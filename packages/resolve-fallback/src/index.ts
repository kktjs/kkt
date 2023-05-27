import webpack, { Configuration } from 'webpack';

export default function resolveFallback(conf: Configuration): Configuration {
  if (!conf) {
    throw Error('KKT:@kkt/resolve-fallback: there is no config found');
  }
  conf.resolve.fallback = Object.assign(conf.resolve.fallback || {}, {
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    fs: false,
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url'),
  });
  conf.module.rules.unshift({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // disable the behavior
    },
  });
  conf.plugins = (conf.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  return conf;
}
