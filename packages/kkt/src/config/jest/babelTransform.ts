import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: [
    [require.resolve('@tsbb/babel-preset-tsbb'), {
      targets: {
        browsers: ['last 2 versions', 'ie >= 10'],
      },
      presetReact: true,
    }]
  ],
});
