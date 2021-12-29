import webpack from 'webpack';
import path from 'path';
import lessModules from '@kkt/less-modules';
import pkg from './package.json';

export default (conf, env, options) => {
  conf = lessModules(conf, env, options);
  // Get the project version.
  conf.plugins.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );
  return conf;
};

export const proxySetup = () => {
  return {
    path: path.resolve('./mocker/index.js'),
    option: {
      proxy: {
        '/repos/(.*)': 'https://api.github.com/',
      },
      changeHost: true,
    },
  };
};
