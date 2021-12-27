process.env.NODE_ENV = 'development';

import fs from 'fs';
import webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import redirectServedPath from 'react-dev-utils/redirectServedPathMiddleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import { KKTRC, DevServerConfigFunction } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, proxySetup } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { overridesOpenBrowser } from '../overrides/openBrowser';
import { overridesClearConsole } from '../overrides/clearConsole';
import { overridesChoosePort } from '../overrides/choosePort';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';
import { cacheData } from '../utils/cacheData';
import { checkRequiredFiles } from '../overrides/checkRequired';
import { StartArgs } from '..';

export default async function start(argvs: StartArgs) {
  try {
    const paths = await overridePaths(argvs);
    await checkRequiredFiles(paths);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.dev' : ''}`;
    const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config.js`;
    const createWebpackConfig: (env: string) => Configuration = require(webpackConfigPath);
    const createDevServerConfig: DevServerConfigFunction = require(devServerConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    await overridesClearConsole(argvs);
    await overridesOpenBrowser(argvs);

    /**
     * Override DevServerConfig
     */
    const overrideDevServerConfig: WebpackDevServer.Configuration = { headers: { 'Access-Control-Allow-Origin': '*' } };

    // Source maps are resource heavy and can cause out of memory issue for large source files.
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const overridesHandle = (kktrc.default || kktrc) as KKTRC['default'];
    if (overridesHandle && typeof overridesHandle === 'function') {
      const webpackConf = miniCssExtractPlugin(createWebpackConfig('development'));
      await overridePaths(undefined, { proxySetup });
      if (kktrc && kktrc.proxySetup && typeof kktrc.proxySetup === 'function') {
        cacheData({ proxySetup: kktrc.proxySetup });
      }
      const overrideWebpackConf = await overridesHandle(
        argvs.overridesWebpack ? argvs.overridesWebpack(webpackConf) : webpackConf,
        'development',
        {
          ...argvs,
          devServerConfigHandle: createDevServerConfig,
          shouldUseSourceMap,
          paths,
          kktrc,
        },
      );
      if (overrideWebpackConf.devServer) {
        /**
         * Modify Client Server Port
         */
        await overridesChoosePort(Number(overrideWebpackConf.devServer.port));
        (Object.keys(overrideWebpackConf.devServer) as Array<keyof typeof overrideWebpackConf.devServer>).forEach(
          (keyName) => {
            (overrideDevServerConfig as any)[keyName] = overrideWebpackConf.devServer[keyName];
          },
        );
        delete overrideWebpackConf.devServer;
      }
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => {
        return overrideWebpackConf;
      };
    }

    // override config in memory
    require.cache[require.resolve(devServerConfigPath)].exports = (
      proxy: WebpackDevServer.ProxyArray,
      allowedHost: string,
    ) => {
      let serverConf = createDevServerConfig(proxy, allowedHost);
      /**
       * [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
       * (Use `node --trace-deprecation ...` to show where the warning was created)
       * [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
       */
      delete serverConf.onAfterSetupMiddleware;
      delete serverConf.onBeforeSetupMiddleware;
      if (kktrc && kktrc.devServer && typeof kktrc.devServer === 'function') {
        return kktrc.devServer({ ...overrideDevServerConfig, ...serverConf }, { ...argvs, paths });
      } else {
        serverConf = { ...overrideDevServerConfig, ...serverConf };
      }
      delete serverConf.onAfterSetupMiddleware;
      delete serverConf.onBeforeSetupMiddleware;
      serverConf.setupMiddlewares = (middlewares, devServer) => {
        // Keep `evalSourceMapMiddleware`
        // middlewares before `redirectServedPath` otherwise will not have any effect
        // This lets us fetch source contents from webpack for the error overlay
        devServer.app.use(evalSourceMapMiddleware(devServer));

        if (fs.existsSync(paths.proxySetup)) {
          // This registers user provided middleware for proxy reasons
          require(paths.proxySetup)(devServer.app);
        }

        // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
        devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
        devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
        return middlewares;
      };
      return serverConf;
    };
    // For real-time output of JS, For Chrome Plugin
    if (argvs['watch']) {
      const configFactory = require(`${reactScripts}/config/webpack.config`);
      const config = configFactory('development');
      const compiler = webpack(config);
      // eslint-disable-next-line
      compiler.watch({ ...config.watchOptions }, (err, stats) => {
        if (err) {
          console.log('❌ errors:', err);
          return;
        }
        console.log('🚀 started!');
      });
    } else {
      // run original script
      require(`${reactScripts}/scripts/start`);
    }
  } catch (error) {
    console.log('KKT:START:ERROR:', error);
  }
}
