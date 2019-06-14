// Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript and some ESnext features.
module.exports = (conf, { raw, kktrc, ...otherOption }) => {
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };
  mainBabelOptions.presets.push([
    require.resolve('@tsbb/babel-preset-tsbb'), {
      modules: false,
      targets: {
        browsers: ['last 2 versions', 'ie >= 10'],
      },
      transformRuntime: {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    },
  ]);
  mainBabelOptions.presets.push(require.resolve('@babel/preset-react'));

  if (process.env.NODE_ENV === 'production') {
    mainBabelOptions.compact = true;
  }

  // Allow app to override babel options
  const babelOptions = kktrc && kktrc.babel
    ? kktrc.babel(mainBabelOptions, { raw, ...otherOption })
    : mainBabelOptions;

  const babelInclude = kktrc.babelInclude || [];

  conf.module.rules = [
    ...conf.module.rules,
    {
      test: /\.(js|mjs|jsx)$/,
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
