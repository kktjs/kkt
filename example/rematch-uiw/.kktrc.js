import path from 'path';
import lessModules from '@kkt/less-modules';
import apiMocker from '@kkt/mocker-api';

export default (conf, env, options) => {
  conf = lessModules(conf, env, options);
  return conf;
}

export const devServer = (configFunction) => (proxy, allowedHost) => {
  // Create the default config by calling configFunction with the proxy/allowedHost parameters
  let config = configFunction(proxy, allowedHost);

  config = apiMocker(config, path.resolve('./mocker/index.js'), {
    proxy: {
      '/repos/(.*)': 'https://api.github.com/',
    },
    changeHost: true,
  });
  // Return your customised Webpack Development Server config.
  return config;
}
