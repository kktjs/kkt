import path from 'path';
import fs from 'fs-extra';
import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin, { BasePluginOptions, DefinedDefaultMinimizerAndOptions } from 'css-minimizer-webpack-plugin';
import { overridePaths, LoaderConfOptions } from 'kkt';
import './overridesCheckRequiredFiles';
import { checkRequiredFiles } from './checkRequiredFiles';
import TerserPlugin, {
  DefinedDefaultMinimizerAndOptions as TerserPluginDefinedDefaultMinimizerAndOptions,
} from 'terser-webpack-plugin';

export type ReactLibraryOptions = LoaderConfOptions & {
  bundle?: boolean;
  mini?: boolean;
  name?: string;
  module?: string;
  main?: string;
  outputDir?: string;
  dependencies?: Configuration['externals'];
  cssMinimizerPluginOptions?: BasePluginOptions & DefinedDefaultMinimizerAndOptions<any>;
  miniCssExtractPluginOptions?: MiniCssExtractPlugin.PluginOptions;
  terserPluginOptions?: BasePluginOptions & TerserPluginDefinedDefaultMinimizerAndOptions<any>;
};

/** Output Dir */
let outputDir = path.join(process.cwd(), 'dist');
let buildCacheDir = '';
let fileName = '';
let publicPath = '';
process.on('beforeExit', () => {
  fs.ensureDirSync(outputDir);
  if (buildCacheDir) {
    console.log(`Output Dir: \x1b[32m${outputDir}\x1b[0m.`);
    console.log(` ╰┬┈┈┈┈▷ The \x1b[32m${outputDir.replace(process.cwd(), '')}\x1b[0m folder is ready.`);
    const dirs = (fs.readdirSync(buildCacheDir, {}) as string[]).filter((name: any) =>
      new RegExp(`^${fileName}\.`).test(name),
    );
    dirs.forEach((name, idx) => {
      console.log(`  ${dirs.length === idx + 1 ? '╰' : '├'}┈ File: \x1b[32m${name}\x1b[0m.`);
      fs.copyFileSync(path.join(buildCacheDir, name), path.join(outputDir, name));
    });
  }
  if (publicPath) {
    fs.removeSync(publicPath);
  }
});

export default (conf: Configuration, env: string, options = {} as ReactLibraryOptions): Configuration => {
  if (!conf) {
    throw Error('KKT:ConfigPaths: there is no config file found');
  }
  if (!options.bundle && options.paths) {
    /**
     * Remove validation first, then add validation
     * Warn and crash if required files are missing
     */
    if (!checkRequiredFiles([options.paths.appHtml, options.paths.appIndexJs], false)) {
      process.exit(1);
    }
  }

  if (options.bundle) {
    if (options.paths.appPath) {
      publicPath = path.join(options.paths.appPath, 'public');
      if (fs.existsSync(publicPath)) {
        publicPath = '';
      } else {
        fs.ensureDirSync(publicPath);
      }
    }
    outputDir = options.outputDir || outputDir;
    buildCacheDir = path.join(process.cwd(), 'node_modules', '.cache', 'kkt', options.mini ? '.~lib.min' : '.~lib');

    /** 确保缓存目录存在 */
    fs.ensureDirSync(buildCacheDir);
    overridePaths(undefined, { appBuild: buildCacheDir });

    const libraryName = path.basename(options.name);
    const entryFile = options.module;
    const outFile = path.basename(options.main);
    let minfilename = outFile.split('.');
    fileName = minfilename[0] || libraryName;
    minfilename.splice(1, 0, 'min');

    conf.entry = path.resolve(entryFile);
    conf.devtool = false;
    conf.output = {
      library: libraryName,
      // commonjs
      libraryTarget: 'umd',
      filename: outFile,
      path: buildCacheDir,
    };
    conf.externals = options.dependencies;
    /**
     * Clear all plugins from CRA webpack conf
     */
    const regexp = /(MiniCssExtractPlugin)/;
    conf.plugins = conf.plugins
      .map((item) => {
        if (item.constructor && item.constructor.name && !regexp.test(item.constructor.name)) {
          return null;
        } else if (regexp.test(item.constructor.name)) {
          return new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: `${options.mini ? `${fileName}.min` : fileName}.css`,
            ...options.miniCssExtractPluginOptions,
          });
        }
        return item;
      })
      .filter(Boolean);

    if (!options.mini) {
      conf.optimization = {
        minimize: false,
        minimizer: [],
      };
    } else {
      conf.plugins.push(new CssMinimizerPlugin({ ...options.cssMinimizerPluginOptions }));
      conf.optimization!.minimizer!.push(
        new TerserPlugin({
          // cache: true,
          parallel: true,
          // sourceMap: true, // Must be set to true if using source-maps in production
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
          ...options.terserPluginOptions,
        }),
      );
      conf.output.filename = minfilename.join('.');
      delete conf.optimization.runtimeChunk;
      delete conf.optimization.splitChunks;
    }
  }
  return conf;
};
