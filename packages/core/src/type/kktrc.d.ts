import * as webpack from 'webpack';
import { Argv } from 'yargs';
import { MockerOption } from 'mocker-api';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ClientEnvironment } from '../config/env';

export type Webpack = typeof webpack;

export interface OptionConf {
  /**
   * 环境变量
   */
  env: string;
  dotenv: ClientEnvironment;
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  isEnvProductionProfile: boolean;
  shouldUseSourceMap: boolean;
  useTypeScript: boolean;
  publicUrlOrPath: string;
  yargsArgs: Argv;
  paths: {
    moduleFileExtensions: string[];
  };
  moduleScopePluginOpts?: ModuleScopePluginOpts;
  MiniCssExtractPlugin: typeof MiniCssExtractPlugin;
}


/**
 * This is the setting for the Plug-in `new ModuleScopePlugin`.
 * 
 * Prevents users from importing files from outside of src/ (or node_modules/).
 * This often causes confusion because we only process files within src/ with babel.
 * To fix this, we prevent you from importing files out of src/ -- if you'd like to,
 * please link the files into your node_modules/ and let module-resolution kick in.
 * Make sure your source files are compiled, as they will not be processed in any way.
 * */
export type ModuleScopePluginOpts = string[];

/**
 * Support for Less.
 * Opt-in support for Less (using `.scss` or `.less` extensions).
 * By default we support Less Modules with the
 * extensions `.module.less` or `.module.less`
 **/
export type LoaderOneOf = string[] | [string, object?][];

/**
 * Modify the default loader
 */
export interface LoaderDefaultResult<OptionConf> {
  url: (conf: webpack.Configuration, optionConf: OptionConf) => void;
  babel: (conf: webpack.Configuration, optionConf: OptionConf) => void;
  css: (conf: webpack.Configuration, optionConf: OptionConf) => void;
  file: (conf: webpack.Configuration, optionConf: OptionConf) => void;
}

export interface KKTRC {
  /**
   * Modify webpack configuration
   */
  default?: (conf: webpack.Configuration, optionConf: OptionConf, webpack: Webpack) => webpack.Configuration;
  /**
   * Modify the default loader
   */
  loaderDefault?: (opts: LoaderDefaultResult<OptionConf>, conf: webpack.Configuration, optionConf: OptionConf) => LoaderDefaultResult<OptionConf>;
  /**
   * Loader is added before the default LoaderDefaultResult.
   * Reference: [@kkt/loader-less](https://www.npmjs.com/package/@kkt/loader-less)
   */
  loaderOneOf?: LoaderOneOf;
  /**
   * 
   * Prevents users from importing files from outside of src/ (or node_modules/).
   * This often causes confusion because we only process files within src/ with babel.
   * To fix this, we prevent you from importing files out of src/ -- if you'd like to,
   * please link the files into your node_modules/ and let module-resolution kick in.
   * Make sure your source files are compiled, as they will not be processed in any way.
   */
  moduleScopePluginOpts?: ModuleScopePluginOpts;
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
