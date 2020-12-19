import path from 'path';
import { Configuration, ExternalsObjectElement } from 'webpack';
import { ParsedArgs } from 'minimist';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export type ReactLibraryOptions = ParsedArgs & {
  name?: string;
  module?: string;
  dependencies?: Record<string, string>;
}

export default (conf: Configuration, env: string, options = {} as ReactLibraryOptions): Configuration => {
  if (options.bundle) {
    const libraryName = path.basename(options.name);
    const entryFile = options.module;
    const outFile = path.basename(options.main);
    let minfilename = outFile.split('.');
    minfilename.splice(1, 0, 'min');

    conf.entry = path.resolve(entryFile);
    conf.devtool = false;
    conf.output = {
      library: libraryName,
      // commonjs
      libraryTarget: 'umd',
      filename: outFile,
      path: path.join(process.cwd(), 'dist'),
    }

    let externals = {} as ExternalsObjectElement;
    Object.keys(options.dependencies || {}).forEach(key => {
      externals[key] = `commonjs ${key}`;
    });
    conf.externals = externals;
    /**
    * Clear all plugins from CRA webpack conf
    */
    const regexp = /(MiniCssExtractPlugin)/;
    conf.plugins = conf.plugins.map((item) => {
      if (item.constructor && item.constructor.name && !regexp.test(item.constructor.name)) {
        return null;
      } else if (regexp.test(item.constructor.name)) {
        return new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: `${options.mini ? minfilename.join('.') : outFile}.css`,
        });
      }
      return item;
    }).filter(Boolean);

    if (!options.mini) {
      conf.optimization = {
        minimize: false,
        minimizer: [],
      };
    } else {
      conf.output.filename = minfilename.join('.');
      delete conf.optimization.runtimeChunk;
    }
  }
  return conf
}