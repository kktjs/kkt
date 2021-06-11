process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import webpack, { Configuration } from 'webpack';
import WebpackDevServer, { ProxyConfigArrayItem } from 'webpack-dev-server';
import { KKTRC, DevServerConfigFunction } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, proxySetup } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { overridesOpenBrowser } from '../overrides/openBrowser';
import { overridesClearConsole } from '../overrides/clearConsole';
import { overridesChoosePort } from '../overrides/choosePort';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';
import { cacheData } from '../utils/cacheData';
import { StartArgs } from '..';

export default async function start(argvs: StartArgs) {
  try {
    const paths = await overridePaths(argvs);
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
        await overridesChoosePort(overrideWebpackConf.devServer.port);
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
      proxy: ProxyConfigArrayItem[],
      allowedHost: string,
    ) => {
      let serverConf = createDevServerConfig(proxy, allowedHost);
      if (kktrc && kktrc.devServer && typeof kktrc.devServer === 'function') {
        return kktrc.devServer({ ...overrideDevServerConfig, ...serverConf }, { ...argvs, paths });
      } else {
        serverConf = { ...overrideDevServerConfig, ...serverConf };
      }
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
