import webpack, { Configuration } from 'webpack';

export default function resolveFallback(conf: Configuration): Configuration {
  if (!conf) {
    throw Error('KKT:@kkt/resolve-fallback: there is no config found');
  }
  conf.resolve.fallback = Object.assign(conf.resolve.fallback || {}, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
  });
  conf.plugins = (conf.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  return conf;
}
