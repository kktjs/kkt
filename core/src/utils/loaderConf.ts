import { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { MockerOption, MockerProxyRoute } from 'mocker-api';
import express from 'express';
import * as babel from '@babel/core';
import fs from 'fs-extra';
import path from 'path';
import { ParsedArgs } from 'minimist';
import { OverridePaths } from '../overrides/paths';

const tsOptions = {
  compilerOptions: {
    target: 'es6',
    module: 'commonjs',
    lib: ['dom', 'es2016', 'es2017'],
    strictPropertyInitialization: false,
    noUnusedLocals: false,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
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
  proxy: WebpackDevServer.ProxyConfigArrayItem[],
  allowedHost: string,
) => WebpackDevServer.Configuration;

export type DevServerOptions = ParsedArgs & Pick<LoaderConfOptions, 'paths' | 'paths'>;
export type WebpackConfiguration = Configuration & {
  devServer?: WebpackDevServer.Configuration
}

export type KKTRC = {
  proxySetup?: (app: express.Application) => MockerAPIOptions;
  devServer?: (config: WebpackDevServer.Configuration, options: DevServerOptions) => WebpackDevServer.Configuration;
  default?: (conf: WebpackConfiguration, evn: string, options: LoaderConfOptions) => WebpackConfiguration | Promise<WebpackConfiguration>;
};

export async function loaderConf(rcPath: string): Promise<KKTRC> {
  let kktrc: KKTRC = {};
  const confJsPath = `${rcPath}.js`;
  const confTsPath = `${rcPath}.ts`;
  const cachePath = path.join(path.dirname(confJsPath), `~.${path.basename(confJsPath)}`);
  try {
    if (fs.existsSync(confTsPath)) {
      require('ts-node').register(tsOptions);
      kktrc = await import(confTsPath);
      return kktrc;
    }
    if (fs.existsSync(confJsPath)) {
      const { code } = babel.transformFileSync(confJsPath, {
        presets: [
          [
            require.resolve('@tsbb/babel-preset-tsbb'),
            {
              targets: false,
            },
          ],
        ],
      });

      await fs.outputFile(cachePath, code);
      kktrc = await import(cachePath);
      await fs.remove(cachePath);
    }
    return kktrc;
  } catch (error) {
    await fs.remove(cachePath);
    console.log('Invalid \x1b[31;1m .kktrc.js \x1b[0m file.\n', error);
    new Error('Invalid .kktrc.js file.');
    process.exit(1);
  }
}
