import path from 'path';
import lessModules from '@kkt/less-modules';

export default (conf, env, options) => {
  conf = lessModules(conf, env, options);
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
