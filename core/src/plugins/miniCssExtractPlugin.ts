import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export { MiniCssExtractPlugin };

/**
 * Fix Conflicting order
 * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250#issuecomment-532483344
 * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/493
 * https://github.com/kktjs/kkt/issues/336
 *
 * ```
 * No module factory available for dependency type: CssDependency
 * chunk 0 [mini-css-extract-plugin]
 * Conflicting order. Following module has been added:
 * ```
 * @param conf
 * @param options
 */
export const miniCssExtractPlugin = (
  conf: Configuration,
  env: 'development' | 'production',
  options: MiniCssExtractPlugin.PluginOptions = {},
) => {
  const regexp = /(MiniCssExtractPlugin)/;
  conf.plugins = (conf.plugins || [])
    .map((item) => {
      if (item && item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
        return new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          /**
           * @error Fix Conflicting order
           */
          ignoreOrder: true,
          ...options,
        });
      }
      return item;
    })
    .filter(Boolean);
  return conf;
};
