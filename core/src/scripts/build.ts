process.env.NODE_ENV = "production";

import { ParsedArgs } from 'minimist';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory } from '../utils/path';

import overridesPaths from '../overrides/paths';

export default async function build(argvs: ParsedArgs) {
  try {
    await overridesPaths(argvs);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.prod' : ''}`;
    const webpackConfig = require(webpackConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    const overridesHandle = kktrc.default || kktrc;

    if (overridesHandle && typeof overridesHandle === 'function') {
      // Source maps are resource heavy and can cause out of memory issue for large source files.
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = isWebpackFactory
        ? (env: string) => overridesHandle(webpackConfig(env), env, { ...argvs, shouldUseSourceMap })
        : overridesHandle(webpackConfig, process.env.NODE_ENV, { ...argvs, shouldUseSourceMap });
    }
  
    // run original script
    require(`${reactScripts}/scripts/build`);
  } catch (error) {
    console.log('KKT:BUILD:ERROR:', error);
  }
}
