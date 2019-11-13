import { Configuration } from 'webpack';
import * as paths from '../config/paths';
import { OptionConf } from '../config/webpack.config';

// First, run the linter.
// It's important to do this before Babel processes the JS.
module.exports = (conf: Configuration, { dotenv }: OptionConf) => {
  return [
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      enforce: 'pre',
      // use: [
      //   {
      //     options: {
      //       formatter: require.resolve('react-dev-utils/eslintFormatter'),
      //       eslintPath: require.resolve('eslint'),
      //       resolvePluginsRelativeTo: __dirname,
      //     },
      //     loader: require.resolve('eslint-loader'),
      //   },
      // ],
      include: paths.appSrc,
    }
  ];
};
