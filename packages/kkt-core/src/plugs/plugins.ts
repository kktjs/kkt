import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import resolve from 'resolve';
import ManifestPlugin, { FileDescriptor } from 'webpack-manifest-plugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import { OptionConf } from '../config/webpack.config';
import * as paths from '../config/paths';

interface ProcessEx extends NodeJS.ProcessVersions {
  pnp?: string;
}

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

module.exports = (conf: Configuration, options: OptionConf) => {
  // Generates an `index.html` file with the <script> injected.
  conf.plugins.push(new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: paths.appHtml,
      },
      options.isEnvProduction
        ? {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }
        : undefined
    )
  ));

  if (options.isEnvProduction && shouldInlineRuntimeChunk) {
    conf.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]));
  }
  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
  // It will be an empty string unless you specify "homepage"
  // in `package.json`, in which case it will be the pathname of that URL.
  conf.plugins.push(new InterpolateHtmlPlugin(HtmlWebpackPlugin, options.dotenv.raw));
  // This gives some necessary context to module not found errors, such as
  // the requesting resource.
  conf.plugins.push(new ModuleNotFoundPlugin(paths.appPath as string));
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV is set to production
  // during a production build.
  // Otherwise React will be compiled in the very slow development mode.
  conf.plugins.push(new webpack.DefinePlugin(options.dotenv.stringified));
  if (options.isEnvDevelopment) {
    // This is necessary to emit hot updates (currently CSS only):
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    conf.plugins.push(new CaseSensitivePathsPlugin());
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    conf.plugins.push(new WatchMissingNodeModulesPlugin(paths.appNodeModules as string));
  }
  if (options.isEnvProduction) {
    conf.plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }));
  }
  // Generate an asset manifest file with the following content:
  // - "files" key: Mapping of all asset filenames to their corresponding
  //   output file so that tools can pick it up without having to parse
  //   `index.html`
  // - "entrypoints" key: Array of files which are included in `index.html`,
  //   can be used to reconstruct the HTML if necessary
  conf.plugins.push(new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: options.publicUrlOrPath,
    generate: (seed: object, files: FileDescriptor[], entrypoints: any) => {
      const manifestFiles = files.reduce((manifest: any, file: any) => {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);

      const entrypointFiles = entrypoints.main.filter(
        (fileName: string) => !fileName.endsWith('.map')
      );
      return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
      };
    },
  } as ManifestPlugin.Options));

  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  conf.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  if (options.isEnvProduction) {
    conf.plugins.push(new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: options.publicUrlOrPath + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp('/[^/?]+\\.[^/]+$'),
      ],
    }))
  }
  if(options.useTypeScript) {
    conf.plugins.push(new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules as string,
      }),
      async: options.isEnvDevelopment,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      resolveModuleNameModule: (process.versions as ProcessEx).pnp
        ? `${__dirname}/pnpTs.js`
        : undefined,
      resolveTypeReferenceDirectiveModule: (process.versions as ProcessEx).pnp
        ? `${__dirname}/pnpTs.js`
        : undefined,
      tsconfig: paths.appTsConfig,
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      watch: paths.appSrc,
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: options.isEnvProduction ? typescriptFormatter : undefined,
    }))
  }
  return conf;
};
