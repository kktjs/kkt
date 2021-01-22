process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { ParsedArgs } from 'minimist';
import { ProxyConfigArrayItem } from 'webpack-dev-server';
import { KKTRC, DevServerConfigFunction } from '../utils/loaderConf';
import { reactScripts, isWebpackFactory, proxySetup } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { overridesOpenBrowser } from '../overrides/openBrowser';
import { overridesClearConsole } from '../overrides/clearConsole';
import { miniCssExtractPlugin } from '../utils/miniCssExtractPlugin';
import { cacheData } from '../utils/cacheData';

export default async function build(argvs: ParsedArgs) {
  try {
    const paths = await overridePaths(argvs);
    const webpackConfigPath = `${reactScripts}/config/webpack.config${!isWebpackFactory ? '.dev' : ''}`;
    const devServerConfigPath = `${reactScripts}/config/webpackDevServer.config.js`;
    const webpackConfig = require(webpackConfigPath);
    const devServerConfigHandle: DevServerConfigFunction = require(devServerConfigPath);
    const overrides = require('../overrides/config');
    const kktrc: KKTRC = await overrides();
    await overridesOpenBrowser(argvs);
    await overridesClearConsole(argvs);
    // override config in memory
    require.cache[require.resolve(devServerConfigPath)].exports = (
      proxy: ProxyConfigArrayItem[],
      allowedHost: string,
    ) => {
      const serverConf = devServerConfigHandle(proxy, allowedHost);
      serverConf.headers = { ...serverConf.headers, 'Access-Control-Allow-Origin': '*' };
      if (kktrc && kktrc.devServer && typeof kktrc.devServer === 'function') {
        return kktrc.devServer(serverConf);
      }
      return serverConf;
    };
    // Source maps are resource heavy and can cause out of memory issue for large source files.
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const overridesHandle = (kktrc.default || kktrc) as KKTRC['default'];
    if (overridesHandle && typeof overridesHandle === 'function') {
      const webpackConf = miniCssExtractPlugin(webpackConfig('development'));
      // override config in memory
      require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => {
        overridePaths(undefined, { proxySetup });
        if (kktrc && kktrc.proxySetup && typeof kktrc.proxySetup === 'function') {
          cacheData({ proxySetup: kktrc.proxySetup });
        }
        return overridesHandle(webpackConf, env, { ...argvs, shouldUseSourceMap, paths, devServerConfigHandle, kktrc });
      };
    }

    // run original script
    require(`${reactScripts}/scripts/start`);
  } catch (error) {
    console.log('KKT:START:ERROR:', error);
  }
}
