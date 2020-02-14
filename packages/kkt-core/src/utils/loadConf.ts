import { Configuration } from 'webpack';
import { MockerOption } from 'mocker-api';
import fs from 'fs-extra';
import path from 'path';
import * as babel from "@babel/core";
import color from 'colors-cli/safe';
import { OptionConf } from '../config/webpack.config';

export interface LoaderDefaultResult {
  url: (conf: Configuration, optionConf: OptionConf) => void;
  babel: (conf: Configuration, optionConf: OptionConf) => void;
  css: (conf: Configuration, optionConf: OptionConf) => void;
  file: (conf: Configuration, optionConf: OptionConf) => void;
}

export interface KKTRC {
  /**
   * Modify webpack configuration
   */
  default?: (conf: Configuration, optionConf: OptionConf, webpack: any) => Configuration;
  /**
   * Modify the default loader
   */
  loaderDefault: (opts: LoaderDefaultResult, conf: Configuration, optionConf: OptionConf) => LoaderDefaultResult;
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

export default async function(rcPath: string): Promise<KKTRC> {
  let kktrc: any = () => {};
  try {
    let exists = fs.existsSync(rcPath);
    // Support TS conf file.
    if(!exists) {
      rcPath = rcPath.replace(/\.js$/, '.ts');
      exists = fs.existsSync(rcPath);
    }
    if (exists) {
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
      const confFun = require(kktrcPath);
      kktrc = confFun as KKTRC;
    }
  } catch (error) {
    console.log(color.red('Invalid .kktrc.js file.'), error);
  }
  return kktrc;
}