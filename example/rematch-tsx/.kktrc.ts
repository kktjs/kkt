import webpack, {Configuration} from 'webpack';
import path from 'path';
import { LoaderConfOptions } from 'kkt';
import lessModules from '@kkt/less-modules';
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

export const proxySetup = () => {
  return {
    path: path.resolve('./mocker/index.js'),
  }
}
