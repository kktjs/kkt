import { Configuration } from 'webpack';
import { OptionConf } from 'kkt';

export interface RawOption {
  /**
   * ext name
   * Default: ['md']
   */
  ext?: string[];
  /**
   * Uses ES modules syntax
   * Type: Boolean Default: true
   */
  esModule?: boolean;
}

module.exports = (conf: Configuration, options: OptionConf, rawOption: RawOption = {}) => {
  const { ext = ['md'], esModule = true } = rawOption;
  let reg = new RegExp(`.(${ext.join('|')})$`);
  return [
    {
      test: reg,
      use: [
        {
          loader: require.resolve('raw-loader'),
          options: { esModule },
        }
      ]
    }
  ];
}
