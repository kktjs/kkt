
// First, run the linter.
// It's important to do this before Babel processes the JS.
module.exports = (conf, { raw }) => {
  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.(js|mjs|jsx)$/,
      include: raw.APPSRC,
      enforce: 'pre',
      use: [
        {
          options: {
            eslintPath: require.resolve('eslint'),
            configFile: require.resolve('../.eslintrc.js'),
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
    },
  ];
  return conf;
};
