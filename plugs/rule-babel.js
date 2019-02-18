// Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript and some ESnext features.
module.exports = (conf, { raw, kktrc, ...otherOption }) => {
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };
  mainBabelOptions.presets.push(require.resolve('../babel'));

  // Allow app to override babel options
  const babelOptions = kktrc && kktrc.babel
    ? kktrc.babel(mainBabelOptions, { raw, ...otherOption })
    : mainBabelOptions;

  const babelInclude = kktrc.babelInclude || [];

  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [raw.APPSRC, ...babelInclude],
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelOptions,
        },
      ],
    },
  ];
  return conf;
};
