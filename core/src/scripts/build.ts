process.env.NODE_ENV = 'production';

import { Configuration } from 'webpack';
import { KKTRC, WebpackConfiguration, loaderConf } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, configOverrides } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { miniCssExtractPlugin } from '../plugins/miniCssExtractPlugin';
import { checkRequiredFiles } from '../overrides/checkRequired';
import { loadSourceMapWarnning } from '../plugins/loadSourceMapWarnning';
import { BuildArgs } from '..';

export default async function build(argvs: BuildArgs) {
  const { isNotCheckHTML = false } = argvs || {};
  try {
    const paths = overridePaths(argvs, argvs.overridePaths);
    await checkRequiredFiles(paths, isNotCheckHTML);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.prod' : ''}`;
    const createWebpackConfig: (env: string) => Configuration = require(webpackConfigPath);
    const kktrc: KKTRC = await loaderConf(configOverrides);
    const overridesHandle = kktrc.default || argvs.overridesWebpack;

    if (overridesHandle && typeof overridesHandle === 'function') {
      // Source maps are resource heavy and can cause out of memory issue for large source files.
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
      const overrideOption = {
        ...argvs,
        shouldUseSourceMap,
        paths,
        kktrc,
      };
      let defaultWepack: WebpackConfiguration = createWebpackConfig('production');
      defaultWepack = loadSourceMapWarnning(defaultWepack);
      defaultWepack = miniCssExtractPlugin(defaultWepack, 'production');
      defaultWepack = argvs.overridesWebpack
        ? argvs.overridesWebpack(defaultWepack, 'production', overrideOption)
        : defaultWepack;
      let webpackConf = kktrc.default
        ? await overridesHandle(defaultWepack, 'production', overrideOption)
        : defaultWepack;

      if (webpackConf.proxySetup && typeof webpackConf.proxySetup === 'function') {
        delete webpackConf.proxySetup;
      }
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => webpackConf;
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
