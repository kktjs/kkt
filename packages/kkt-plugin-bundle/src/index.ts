import { Configuration } from 'webpack';
import { OptionConf } from 'kkt/lib/config/webpack.config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

export interface BundlePluginOptions {
  externals?: Configuration['externals'];
  output?: Configuration['output'];
  name?: string;
  entry?: string;
  createCss?: boolean;
}

export interface KKTOpts extends OptionConf {
  yargsArgs: OptionConf['yargsArgs'] & {
    bundle: boolean;
    mini: boolean;
  }
}

export default (conf: Configuration, kktOpts: KKTOpts, { name, output, externals, createCss = true, entry = 'src/components/index.js' }: BundlePluginOptions) => {
  if (kktOpts.yargsArgs && kktOpts.yargsArgs.bundle) {
    const isMini = kktOpts.yargsArgs && kktOpts.yargsArgs.mini;

    conf.devtool = false;
    const regexp = /(HtmlWebpackPlugin|InlineChunkHtmlPlugin|InterpolateHtmlPlugin|MiniCssExtractPlugin|ManifestPlugin|IgnorePlugin|GenerateSW)/;
    conf.plugins = conf.plugins.map((item) => {
      if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
        return null;
      }
      return item;
    }).filter(Boolean);
    conf.entry = path.join(process.cwd(), entry);
    conf.output = {
      futureEmitAssets: true,
      // path: path.join(process.cwd(), 'dist'),
      // library: 'UIW',
      // filename: 'uiw.js',
      filename: isMini ? `${name}.min.js` : `${name}.js`,
      libraryTarget: 'umd',
      ...output,
    }
    conf.externals = {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    }
    if (externals) {
      conf.externals = externals;
    }
    conf.optimization = {
      minimize: kktOpts.isEnvProduction,
      minimizer: [],
    };

    if (!isMini) {
      conf.optimization.minimize = false;
    }

    if (createCss) {
      conf.plugins = [
        ...conf.plugins,
        new MiniCssExtractPlugin({
          // kktOpts similar to the same kktOpts in webpackkktOpts.output
          // both kktOpts are optional
          filename: isMini ? `${name}.min.css` : `${name}.css`,
          // allChunks: true because we want all css to be included in the main
          // css bundle when doing code splitting to avoid FOUC:
          // https://github.com/facebook/create-react-app/issues/2415
          // allChunks: true,
        })
      ];
    }
  }
  return conf
}