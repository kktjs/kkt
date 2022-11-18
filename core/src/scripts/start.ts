process.env.NODE_ENV = 'development';

import fs from 'fs';
import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import redirectServedPath from 'react-dev-utils/redirectServedPathMiddleware';
import clearConsole from 'react-dev-utils/clearConsole';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import { KKTRC, DevServerConfigFunction, WebpackConfiguration, loaderConf } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, proxySetup, getConfPath } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { overridesOpenBrowser } from '../overrides/openBrowser';
import { overridesClearConsole } from '../overrides/clearConsole';
import { overridesChoosePort } from '../overrides/choosePort';
import { miniCssExtractPlugin } from '../plugins/miniCssExtractPlugin';
import { cacheData } from '../utils/cacheData';
import { checkRequiredFiles } from '../overrides/checkRequired';
import { loadSourceMapWarnning } from '../plugins/loadSourceMapWarnning';
import { StartArgs } from '..';

const today = () => new Date().toISOString().split('.')[0].replace('T', ' ');

export default async function start(argvs: StartArgs) {
  const { isNotCheckHTML = false } = argvs || {};
  try {
    const paths = await overridePaths(argvs, argvs.overridePaths);
    await checkRequiredFiles(paths, isNotCheckHTML);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.dev' : ''}`;
    const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config.js`;
    const createWebpackConfig: (env: string) => Configuration = require(webpackConfigPath);
    const createDevServerConfig: DevServerConfigFunction = require(devServerConfigPath);
    require('react-scripts/config/env');
    const kktrc: KKTRC = await loaderConf(getConfPath(argvs.configName));
    await overridesClearConsole(argvs);
    await overridesOpenBrowser(argvs);

    /** Override DevServerConfig */
    let overrideDevServerConfig: WebpackDevServer.Configuration = { headers: { 'Access-Control-Allow-Origin': '*' } };

    // Source maps are resource heavy and can cause out of memory issue for large source files.
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const overridesHandle = kktrc.default || argvs.overridesWebpack;
    if (overridesHandle && typeof overridesHandle === 'function') {
      let webpackConf: WebpackConfiguration = createWebpackConfig('development');
      await overridePaths(undefined, { proxySetup });
      if (kktrc && kktrc.proxySetup && typeof kktrc.proxySetup === 'function') {
        cacheData({ proxySetup: kktrc.proxySetup });
      }
      const overrideOption = {
        ...argvs,
        devServerConfigHandle: createDevServerConfig,
        shouldUseSourceMap,
        paths,
        kktrc,
      };
      webpackConf = argvs.overridesWebpack
        ? argvs.overridesWebpack(webpackConf, 'development', overrideOption)
        : webpackConf;
      webpackConf = loadSourceMapWarnning(webpackConf);
      webpackConf = miniCssExtractPlugin(webpackConf, 'development');
      const overrideWebpackConf = kktrc.default
        ? await overridesHandle(webpackConf, 'development', overrideOption)
        : webpackConf;

      if (overrideWebpackConf.proxySetup && typeof overrideWebpackConf.proxySetup === 'function') {
        cacheData({ proxySetup: overrideWebpackConf.proxySetup });
        delete overrideWebpackConf.proxySetup;
      }

      if (overrideWebpackConf.devServer) {
        /** Modify Client Server Port */
        await overridesChoosePort(Number(overrideWebpackConf.devServer.port));
        overrideDevServerConfig = Object.assign(overrideDevServerConfig, overrideWebpackConf.devServer);
        delete overrideWebpackConf.devServer;
      }
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => overrideWebpackConf;
    }
    // override config in memory
    require.cache[require.resolve(devServerConfigPath)].exports = (
      proxy: WebpackDevServer.Configuration['proxy'],
      allowedHost: string,
    ) => {
      let serverConf = createDevServerConfig(proxy, allowedHost);
      /**
       * [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE]
       * DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
       * (Use `node --trace-deprecation ...` to show where the warning was created)
       * [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE]
       * DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
       */
      delete serverConf.onAfterSetupMiddleware;
      delete serverConf.onBeforeSetupMiddleware;
      if (kktrc && kktrc.devServer && typeof kktrc.devServer === 'function') {
        return kktrc.devServer({ ...overrideDevServerConfig, ...serverConf }, { ...argvs, paths });
      } else {
        serverConf = { ...serverConf, ...overrideDevServerConfig };
      }
      delete serverConf.onAfterSetupMiddleware;
      delete serverConf.onBeforeSetupMiddleware;
      const setupMiddlewares = overrideDevServerConfig.setupMiddlewares;
      serverConf.setupMiddlewares = (middlewares, devServer) => {
        // Keep `evalSourceMapMiddleware`
        // middlewares before `redirectServedPath` otherwise will not have any effect
        // This lets us fetch source contents from webpack for the error overlay
        devServer.app.use(evalSourceMapMiddleware(devServer));
        if (fs.existsSync(paths.proxySetup)) {
          // This registers user provided middleware for proxy reasons
          require(paths.proxySetup)(devServer.app);
        }
        // Configure the `proxySetup` configuration in `.kktrc`.
        if (fs.existsSync(proxySetup)) {
          require(proxySetup)(devServer.app);
        }

        // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
        devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
        devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
        if (setupMiddlewares) {
          return setupMiddlewares(middlewares, devServer);
        }
        return middlewares;
      };
      return serverConf;
    };
    // For real-time output of JS, For Chrome Plugin
    if (argvs['watch']) {
      const configFactory = require(`${reactScripts}/config/webpack.config`);
      const config = configFactory('development');
      const compiler = webpack(config);
      compiler.watch({ ...config.watchOptions }, (err, stats) => {
        if (err) {
          console.log('❌ KKT:\x1b[31;1mERR\x1b[0m:', err);
          return;
        }
        if (stats.hasErrors()) {
          clearConsole();
          console.log(`❌ KKT:\x1b[31;1mERR\x1b[0m: \x1b[35;1m${today()}\x1b[0m\n`, stats.toString());
          return;
        }
        clearConsole();
        console.log(`🚀 started! \x1b[35;1m${today()}\x1b[0m`);
      });
    } else {
      // run original script
      require(`${reactScripts}/scripts/start`);
    }
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT:START:ERROR: \x1b[0m\n', error);
    new Error(`KKT:START:ERROR: \n ${message}`);
    process.exit(1);
  }
}
