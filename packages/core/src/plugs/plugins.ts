import webpack, { Configuration } from 'webpack';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import resolve from 'resolve';
import { FileDescriptor } from 'webpack-manifest-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'react-dev-utils/ForkTsCheckerWebpackPlugin';
import typescriptFormatter from 'react-dev-utils/typescriptFormatter';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { OptionConf } from '../type/kktrc';
import * as paths from '../config/paths';
import hasJsxRuntime from '../utils/hasJsxRuntime';

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
    if (options.shouldUseReactRefresh) {
      conf.plugins.push(new ReactRefreshWebpackPlugin({
        overlay: {
          entry: options.webpackDevClientEntry,
          // The expected exports are slightly different from what the overlay exports,
          // so an interop is included here to enable feedback on module-level errors.
          module: options.reactRefreshOverlayEntry,
          // Since we ship a custom dev client and overlay integration,
          // the bundled socket handling logic can be eliminated.
          sockIntegration: false,
        },
      }))
    }
  }
  if (options.isEnvProduction) {
    conf.plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-532483344
      ignoreOrder: true,
    }));
  }
  // Generate an asset manifest file with the following content:
  // - "files" key: Mapping of all asset filenames to their corresponding
  //   output file so that tools can pick it up without having to parse
  //   `index.html`
  // - "entrypoints" key: Array of files which are included in `index.html`,
  //   can be used to reconstruct the HTML if necessary
  conf.plugins.push(new (ManifestPlugin as any)({
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
  }));

  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  conf.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  if (options.isEnvProduction && fs.existsSync(options.paths.swSrc)) {
    conf.plugins.push(new WorkboxWebpackPlugin.InjectManifest({
      swSrc: options.paths.swSrc,
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      // Bump up the default maximum size (2mb) that's precached,
      // to make lazy-loading failure scenarios less likely.
      // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    }))
  }
  if(options.useTypeScript) {
    conf.plugins.push(new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules,
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
        // This one is specifically to match during CI tests,
        // as micromatch doesn't match
        // '../cra-template-typescript/template/src/App.tsx'
        // otherwise.
        '../**/src/**/*.{ts,tsx}',
        '**/src/**/*.{ts,tsx}',
        '!**/src/**/__tests__/**',
        '!**/src/**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
      // watch: paths.appSrc,
      silent: true,
      // The formatter is invoked directly in WebpackDevServerUtils during development
      formatter: options.isEnvProduction ? typescriptFormatter : undefined,
    }));

    conf.plugins.push(
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        context: paths.appSrc,
        cache: true,
        // ESLint class options
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      })
    )
  }
  return conf;
};
