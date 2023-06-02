import load, { AutoConfOption } from 'auto-config-loader';
import { Configuration } from 'webpack';
import type WebpackDevServer from 'webpack-dev-server';
import { MockerOption, MockerProxyRoute } from 'mocker-api';
import { ParsedArgs } from 'minimist';
import type express from 'express';
import { OverridePaths } from '../overrides/paths';

export type MockerAPIOptions = {
  path: string | string[] | MockerProxyRoute;
  option?: MockerOption;
};

export type LoaderConfOptions = ParsedArgs & {
  paths: OverridePaths;
  shouldUseSourceMap: boolean;
  devServerConfigHandle?: DevServerConfigFunction;
  kktrc: KKTRC;
};

export type DevServerConfigFunction = (
  proxy: WebpackDevServer.Configuration['proxy'],
  allowedHost: string,
) => WebpackDevServer.Configuration;

export type DevServerOptions = ParsedArgs & Pick<LoaderConfOptions, 'paths' | 'paths'>;
export interface WebpackConfiguration extends Configuration {
  devServer?: WebpackDevServer.Configuration;
  /** Configuring the Proxy Manually */
  proxySetup?: (app: express.Application) => MockerAPIOptions;
}

export type KKTRC = {
  /**
   * Still available, may be removed in the future. (仍然可用，将来可能会被删除。)
   * The method has been moved elsewhere.
   * @deprecated
   *
   * The following method is recommended
   *
   * @example
   * ```ts
   * export default (conf: WebpackConfiguration, evn: 'development' | 'production') => {
   *   //....
   *   conf.proxySetup = (app: express.Application): MockerAPIOptions => {
   *     return {
   *       path: path.resolve('./mocker/index.js'),
   *     };
   *   };
   *   return conf;
   * }
   * ```
   */
  proxySetup?: (app: express.Application) => MockerAPIOptions;
  devServer?: (config: WebpackDevServer.Configuration, options: DevServerOptions) => WebpackDevServer.Configuration;
  default?: (
    conf: WebpackConfiguration,
    evn: 'development' | 'production',
    options: LoaderConfOptions,
  ) => WebpackConfiguration | Promise<WebpackConfiguration>;
};

export async function loaderConfig(namespace: string = 'kkt', option?: AutoConfOption<KKTRC>) {
  /** Old ~~`.kktrc`~~ => New `kkt` */
  const name = namespace.replace(/^\.(.*)rc$/g, '$1');
  try {
    const data = load<KKTRC>(name, option);
    return (data || {}) as KKTRC;
  } catch (error) {
    const message = error && error instanceof Error && error.message ? error.message : '';
    console.log('Invalid \x1b[31;1m .kktrc.js \x1b[0m file.\n', error);
    new Error(`Invalid .kktrc.js file. \n ${message}`);
    process.exit(1);
  }
}
