import { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { MockerOption, MockerProxyRoute } from 'mocker-api';
import express from 'express';
import fs from 'fs-extra';
import { ParsedArgs } from 'minimist';
import { OverridePaths } from '../overrides/paths';

const tsOptions = {
  compilerOptions: {
    sourceMap: false,
    target: 'es6',
    module: 'commonjs',
    moduleResolution: 'node',
    allowJs: false,
    declaration: true,
    strict: true,
    noUnusedLocals: true,
    experimentalDecorators: true,
    resolveJsonModule: true,
    esModuleInterop: true,
    removeComments: false,
  },
};

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
  proxy: WebpackDevServer.ProxyArray,
  allowedHost: string,
) => WebpackDevServer.Configuration;

export type DevServerOptions = ParsedArgs & Pick<LoaderConfOptions, 'paths' | 'paths'>;
export type WebpackConfiguration = Configuration & {
  devServer?: WebpackDevServer.Configuration;
};

export type KKTRC = {
  proxySetup?: (app: express.Application) => MockerAPIOptions;
  devServer?: (config: WebpackDevServer.Configuration, options: DevServerOptions) => WebpackDevServer.Configuration;
  default?: (
    conf: WebpackConfiguration,
    evn: string,
    options: LoaderConfOptions,
  ) => WebpackConfiguration | Promise<WebpackConfiguration>;
};

export async function loaderConf(rcPath: string): Promise<KKTRC> {
  let kktrc: KKTRC = {};
  const confJsPath = `${rcPath}.js`;
  const confTsPath = `${rcPath}.ts`;
  try {
    if (fs.existsSync(confTsPath)) {
      require('ts-node').register(tsOptions);
      kktrc = await import(confTsPath);
      return kktrc;
    }
    if (fs.existsSync(confJsPath)) {
      require('@babel/register')({
        presets: [[require.resolve('babel-preset-react-app'), { runtime: 'classic', useESModules: false }]],
      });
      kktrc = await import(confJsPath);
    }
    return kktrc;
  } catch (error) {
    console.log('Invalid \x1b[31;1m .kktrc.js \x1b[0m file.\n', error);
    new Error('Invalid .kktrc.js file.');
    process.exit(1);
  }
}
