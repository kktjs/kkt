process.env.NODE_ENV = 'production';

import { ParsedArgs } from 'minimist';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';

export default async function build(argvs: ParsedArgs) {
  try {
    const paths = await overridePaths(argvs);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.prod' : ''}`;
    const webpackConfig = require(webpackConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    const overridesHandle = kktrc.default || kktrc;

    let afterHandle: () => void = undefined;
    if (overridesHandle && typeof overridesHandle === 'function') {
      // Source maps are resource heavy and can cause out of memory issue for large source files.
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
      const webpackConf = miniCssExtractPlugin(webpackConfig('production'));
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => {
        const conf = overridesHandle(webpackConf, env, { ...argvs, shouldUseSourceMap, paths, kktrc });
        if (conf && conf.config) {
          afterHandle = conf.after;
          return conf.config;
        }
        return conf;
      };
    }

    // run original script
    await require(`${reactScripts}/scripts/build`);
    // Can be used for server-side rendering development
    if (afterHandle && typeof afterHandle === 'function') {
      await afterHandle();
    }
  } catch (error) {
    console.log('KKT:BUILD:ERROR:', error);
  }
}
