
module.exports = (conf, options) => {
  const optionsTS = {
    transpileOnly: true,
  };
  if (options.raw.BUNDLE) {
    delete options.transpileOnly;
  }
  conf.module.rules = [
    ...conf.module.rules,
    // Compile .tsx?
    {
      test: /\.(ts|tsx)$/,
      // include: options.appSrc,
      loader: require.resolve('ts-loader'),
      options: { ...optionsTS },
    },
  ];
  return conf;
};
