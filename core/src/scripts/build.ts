process.env.NODE_ENV = 'production';
import { Configuration } from 'webpack';
import { ParsedArgs } from 'minimist';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';

export interface Build extends ParsedArgs {
  overridesWebpack?: (conf: Configuration) => Configuration;
}

export default async function build(argvs: Build) {
  try {
    const paths = await overridePaths(argvs);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.prod' : ''}`;
    const createWebpackConfig: (env: string) => Configuration = require(webpackConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    const overridesHandle = kktrc.default || kktrc;

    if (overridesHandle && typeof overridesHandle === 'function') {
      // Source maps are resource heavy and can cause out of memory issue for large source files.
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
      const defaultWepack = miniCssExtractPlugin(createWebpackConfig('production'));
      const webpackConf = argvs.overridesWebpack ? argvs.overridesWebpack(defaultWepack) : defaultWepack;
      const overrideWebpackConf = await overridesHandle(webpackConf, 'production', {
        ...argvs,
        shouldUseSourceMap,
        paths,
        kktrc,
      });
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => overrideWebpackConf;
    }

    // run original script
    require(`${reactScripts}/scripts/build`);
  } catch (error) {
    console.log('KKT:BUILD:ERROR:', error);
  }
}
