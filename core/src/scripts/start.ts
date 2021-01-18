process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { ParsedArgs } from 'minimist';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, proxySetup } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import openBrowser from '../overrides/openBrowser';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';
import { cacheData } from '../utils/cacheData';

export default async function build(argvs: ParsedArgs) {
  try {
    await openBrowser(argvs);
    const paths = await overridePaths(argvs);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.dev' : ''}`;
    const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config.js`;
    const webpackConfig = require(webpackConfigPath);
    const devServerConfig = require(devServerConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();

    if (devServerConfig) {
      devServerConfig.headers = {
        ...devServerConfig.headers,
        'Access-Control-Allow-Origin': '*',
      };
    }

    if (kktrc && kktrc.devServer) {
      require.cache[require.resolve(devServerConfigPath)].exports = kktrc.devServer(
        devServerConfig,
        process.env.NODE_ENV,
      );
    }
    // Source maps are resource heavy and can cause out of memory issue for large source files.
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const overridesHandle = kktrc.default || kktrc;
    let afterHandle: () => void = undefined;
    if (overridesHandle && typeof overridesHandle === 'function') {
      const webpackConf = miniCssExtractPlugin(webpackConfig('development'));
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => {
        overridePaths(undefined, { proxySetup });
        if (kktrc && kktrc.proxySetup && typeof kktrc.proxySetup === 'function') {
          cacheData({ proxySetup: kktrc.proxySetup });
        }
        const conf = overridesHandle(webpackConf, env, { ...argvs, shouldUseSourceMap, paths, devServerConfig, kktrc });
        if (conf && conf.config) {
          afterHandle = conf.after;
          return conf.config;
        }
        return conf;
      };
    }

    // run original script
    await require(`${reactScripts}/scripts/start`);
    // Can be used for server-side rendering development
    if (afterHandle && typeof afterHandle === 'function') {
      await afterHandle();
    }
  } catch (error) {
    console.log('KKT:START:ERROR:', error);
  }
}
