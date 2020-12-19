process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { ParsedArgs } from 'minimist';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import openBrowser from '../overrides/openBrowser';

export default async function build(argvs: ParsedArgs) {
  try {
    await openBrowser(argvs);
    await overridePaths(argvs);

    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.dev' : ''}`;
    const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config.js`;
    const webpackConfig = require(webpackConfigPath);
    const devServerConfig = require(devServerConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();

    // Source maps are resource heavy and can cause out of memory issue for large source files.
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

    if (kktrc && kktrc.devServer) {
      require.cache[require.resolve(devServerConfigPath)].exports =
        kktrc.devServer(devServerConfig, process.env.NODE_ENV);
    }

    const overridesHandle = kktrc.default || kktrc;
    if (overridesHandle && typeof overridesHandle === 'function') {
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = isWebpackFactory
        ? (env: string) => overridesHandle(webpackConfig(env), env, { ...argvs, shouldUseSourceMap })
        : overridesHandle(webpackConfig, process.env.NODE_ENV, { ...argvs, shouldUseSourceMap });
    }

    // run original script
    require(`${reactScripts}/scripts/start`);
  } catch (error) {
    console.log('KKT:START:ERROR:', error);
  }
}