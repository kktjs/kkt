process.env.NODE_ENV = 'production';

import { Configuration } from 'webpack';
import { KKTRC } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { miniCssExtractPlugin } from '../plugins/miniCssExtractPlugin';
import { checkRequiredFiles } from '../overrides/checkRequired';
import { loadSourceMapWarnning } from '../plugins/loadSourceMapWarnning';
import { BuildArgs } from '..';

export default async function build(argvs: BuildArgs) {
  try {
    const paths = await overridePaths(argvs);
    await checkRequiredFiles(paths);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.prod' : ''}`;
    const createWebpackConfig: (env: string) => Configuration = require(webpackConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    const overridesHandle = kktrc.default || kktrc;

    if (overridesHandle && typeof overridesHandle === 'function') {
      // Source maps are resource heavy and can cause out of memory issue for large source files.
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
      const overrideOption = {
        ...argvs,
        shouldUseSourceMap,
        paths,
        kktrc,
      };
      let defaultWepack = createWebpackConfig('production');
      defaultWepack = loadSourceMapWarnning(defaultWepack, 'development', overrideOption);
      defaultWepack = miniCssExtractPlugin(defaultWepack, 'development');

      let webpackConf = await overridesHandle(defaultWepack, 'production', overrideOption);
      const overrideWebpackConf = argvs.overridesWebpack ? argvs.overridesWebpack(webpackConf) : webpackConf;
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => overrideWebpackConf;
    }

    // run original script
    await require(`${reactScripts}/scripts/build`);
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT:BUILD:ERROR: \x1b[0m\n', error);
    new Error(`KKT:BUILD:ERROR: \n ${message}`);
    process.exit(1);
  }
}
