import webpack, {Configuration} from 'webpack';
import path from 'path';
import { DevServerConfigFunction, LoaderConfOptions } from 'kkt';
import WebpackDevServer from 'webpack-dev-server';
import lessModules from '@kkt/less-modules';
import apiMocker from '@kkt/mocker-api';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import pkg from './package.json';

export default (conf: Configuration, env: string, options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  conf = rawModules(conf, env, { ...options });
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [
      path.resolve(process.cwd(), 'README.md')
    ]
  });

  // Get the project version.
  conf.plugins!.push(new webpack.DefinePlugin({
    VERSION: JSON.stringify(pkg.version),
  }));
  return conf;
}

export const devServer = (configFunction: DevServerConfigFunction) => (proxy: WebpackDevServer.ProxyConfigArrayItem[], allowedHost: string) => {
  // Create the default config by calling configFunction with the proxy/allowedHost parameters
  let config = configFunction(proxy, allowedHost);

  config = apiMocker(config, path.resolve('./mocker/index.js'));
  // Return your customised Webpack Development Server config.
  return config;
}
