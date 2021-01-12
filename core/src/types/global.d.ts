declare module 'react-dev-utils/crossSpawn' {
  type Options = {
    stdio: 'inherit';
  };
  class crossSpawn {
    sync(
      command: string,
      args: string[],
      options: Options,
    ): {
      signal: 'SIGKILL' | 'SIGTERM';
    };
  }

  let c: crossSpawn;
  export default c;
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

declare module 'postcss-normalize' {
  function _default(): void;
  export default _default;
}
