declare module 'css-minimizer-webpack-plugin' {
  import { Compiler, Plugin } from 'webpack';
  import { CssNanoOptions } from 'cssnano';
  import { SourceMapOptions } from 'postcss';
  class CssMinimizerPlugin implements Plugin {
    constructor(options?: CssMinimizerPlugin.Options);

    /**
     * Apply the plugin
     */
    apply(compiler: Compiler): void;
  }
  namespace CssMinimizerPlugin {
    interface Options {
        minimizerOptions?: CssNanoOptions;
        /**
         * Test to match files against.
         */
        test?: string | RegExp | Array<string | RegExp>;
        /**
         * Files to include
         */
        include?: string | RegExp | Array<string | RegExp>;
        /**
         * Files to exclude.
         */
        exclude?: string | RegExp | Array<string | RegExp>;
        /**
         * Enable file caching.
         * @default 'node_modules/.cache/css-minimizer-webpack-plugin'
         */
        cache?: boolean | string;
        /**
         * Allows you to override default cache keys.
         */
        cacheKeys?: (defaultCacheKeys: CacheKeys, file: string) => CacheKeys;
        /**
         * Use multi-process parallel running to improve the build speed.
         * Default number of concurrent runs: os.cpus().length - 1.
         */
        parallel?: boolean | number;
        /**
         * Enable (and configure) source map support.
         * Use PostCss SourceMap options.
         * Default configuration when enabled: { inline: false }.
         */
        sourceMap?: boolean | SourceMapOptions;
        /**
         * Allows you to override default minify function.
         * By default plugin uses cssnano package. Useful for using and testing unpublished versions or forks.
         */
        minify?: (data: any, inputMap: any, minimizerOptions: any) => any;
        /**
         * Allow to filter css-minimizer warnings (By default cssnano).
         * Return true to keep the warning, a falsy value (false/null/undefined) otherwise.
         */
        warningsFilter?: (warning: string, file: string, source: string) => boolean | undefined | null;
    }
  }
  /**
   * Default cache keys
   */
  interface DefaultCacheKeys {
      cssMinimizer: string;
      'css-minimizer-webpack-plugin': string;
      'css-minimizer-webpack-plugin-options': string;
      path: string;
      hash: string;
  }

  interface CacheKeys extends DefaultCacheKeys {
      [key: string]: string;
  }
  export default CssMinimizerPlugin;
}
declare module 'mini-css-extract-plugin' {
  import { Configuration, Compiler } from 'webpack';

  class MiniCssExtractPlugin {
    /**
     * Webpack loader always used at the end of loaders list (ie. array index zero).
     */
    static loader: string;
    constructor(options?: MiniCssExtractPlugin.PluginOptions);
    /**
     * Apply the plugin
     */
    apply(compiler: Compiler): void;
  }
  namespace MiniCssExtractPlugin {
    interface PluginOptions {
        /**
         * Works like [`output.filename`](https://webpack.js.org/configuration/output/#outputfilename).
         */
        filename?: Required<Configuration>['output']['filename'];
        /**
         * Works like [`output.chunkFilename`](https://webpack.js.org/configuration/output/#outputchunkfilename).
         */
        chunkFilename?: string;
        /**
         * For projects where CSS ordering has been mitigated through consistent
         * use of scoping or naming conventions, the CSS order warnings can be
         * disabled by setting this flag to true for the plugin.
         */
        ignoreOrder?: boolean;
        /**
         * Specify where to insert the link tag.
         *
         * A string value specifies a DOM query for a parent element to attach to.
         *
         * A function allows to override default behavior for non-entry CSS chunks.
         * This code will run in the browser alongside your application. It is recommend
         * to only use ECMA 5 features and syntax. The function won't have access to the
         * scope of the webpack configuration module.
         *
         * @default function() { document.head.appendChild(linkTag); }
         */
        insert?: string | ((linkTag: any) => void);
        /**
         * Specify additional html attributes to add to the link tag.
         *
         * Note: These are only applied to dynamically loaded css chunks. To modify link
         * attributes for entry CSS chunks, please use html-webpack-plugin.
         */
        attributes?: Record<string, string>;
        /**
         * This option allows loading asynchronous chunks with a custom link type, such as
         * `<link type="text/css" ...>`.
         *
         * `false` disables the link `type` attribute.
         *
         * @default 'text/css'
         */
        linkType?: string | false | 'text/css';
    }
    interface LoaderOptions {
        /**
         * Overrides [`output.publicPath`](https://webpack.js.org/configuration/output/#outputpublicpath).
         * @default output.publicPath
         */
        publicPath?: string | ((resourcePath: string, context: string) => string);
        /**
         * By default, `mini-css-extract-plugin` generates JS modules that use the ES modules syntax.
         * There are some cases in which using ES modules is beneficial,
         * like in the case of module concatenation and tree shaking.
         * @default true
         */
        esModule?: boolean;
        modules?: {
            /**
             * Enables/disables ES modules named export for locals.
             *
             * Names of locals are converted to camelCase. It is not allowed to use
             * JavaScript reserved words in CSS class names. Options `esModule` and
             * `modules.namedExport` in css-loader and MiniCssExtractPlugin.loader
             * must be enabled.
             *
             * @default false
             */
            namedExport?: boolean;
        };
    }
  }

  export default MiniCssExtractPlugin;
}