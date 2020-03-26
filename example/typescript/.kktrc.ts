import { OptionConf } from 'kkt/lib/config/webpack.config';
import webpack from 'webpack';

type Webpack = typeof webpack;

export const loaderOneOf = [
  [require.resolve('@kkt/loader-less'), {}],
]

export default (conf: webpack.Configuration, options: OptionConf, webpack: Webpack) => {
  /**
   * Do somthing
   */
  return conf;
}
