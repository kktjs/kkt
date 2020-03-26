import * as webpack from 'webpack';
import { MockerOption } from 'mocker-api';
import fs from 'fs-extra';
import path from 'path';
import * as babel from "@babel/core";
import color from 'colors-cli/safe';

export interface LoaderDefaultResult<T> {
  url: (conf: webpack.Configuration, optionConf: T) => void;
  babel: (conf: webpack.Configuration, optionConf: T) => void;
  css: (conf: webpack.Configuration, optionConf: T) => void;
  file: (conf: webpack.Configuration, optionConf: T) => void;
}

type Webpack = typeof webpack

export interface KKTRC<T> {
  /**
   * Modify webpack configuration
   */
  default?: (conf: webpack.Configuration, optionConf: T, webpack: Webpack) => webpack.Configuration;
  /**
   * Modify the default loader
   */
  loaderDefault?: (opts: LoaderDefaultResult<T>, conf: webpack.Configuration, optionConf: T) => LoaderDefaultResult<T>;
  /**
   * Loader is added before the default LoaderDefaultResult.
   * Reference: [@kkt/loader-less](https://www.npmjs.com/package/@kkt/loader-less)
   */
  loaderOneOf?: string[] | [string, object?][];
  /**
   * 
   * Prevents users from importing files from outside of src/ (or node_modules/).
   * This often causes confusion because we only process files within src/ with babel.
   * To fix this, we prevent you from importing files out of src/ -- if you'd like to,
   * please link the files into your node_modules/ and let module-resolution kick in.
   * Make sure your source files are compiled, as they will not be processed in any way.
   */
  moduleScopePluginOpts?: string[];
  /**
   * mocker-api that creates mocks for REST APIs.
   * It will be helpful when you try to test your application without the actual REST API server.
   * https://github.com/jaywcjlove/mocker-api
   */
  mocker?: {
    path: string | string[];
    /**
     * https://github.com/jaywcjlove/mocker-api/tree/96c2eb94694571e0e3003e6ad9ce1c809499f577#options
     */
    option: MockerOption;
  },
}

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
    emitDecoratorMetadata: true
  }
}

export default async function<T>(rcPath: string): Promise<KKTRC<T>> {
  let kktrc: any = () => {};
  try {
    let exists = fs.existsSync(rcPath);
    // Support TS conf file.
    if(!exists) {
      rcPath = rcPath.replace(/\.js$/, '.ts');
      exists = fs.existsSync(rcPath);
    }
    if (exists) {
      if (/\.ts$/.test(rcPath)) {
        require('ts-node').register(tsOptions);
        kktrc = await import(rcPath);
        return kktrc;
      }
      const { code } = babel.transformFileSync(rcPath, {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            targets: false,
            presetReact: true,
          }],
        ],
      });
      const kktrcPath = path.resolve(process.cwd(), 'node_modules/.cache/kkt/.kktrc.js');
      await fs.ensureDir(path.dirname(kktrcPath));
      await fs.outputFile(kktrcPath, code);
      await import(kktrcPath);
      const confFun: KKTRC<T> = await import(kktrcPath);
      kktrc = confFun;
    }
  } catch (error) {
    console.log(color.red('Invalid .kktrc.js file.\n'), error);
    new Error('Invalid .kktrc.js file.');
    process.exit(1);
  }
  return kktrc;
}