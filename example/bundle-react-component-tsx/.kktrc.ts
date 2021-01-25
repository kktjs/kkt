import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import reactLibrary from '@kkt/react-library';
import lessModules from '@kkt/less-modules';
import pkg from './package.json';

export default (conf: WebpackConfiguration, env: string, options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  conf = reactLibrary(conf, env, {
    ...options,
    ...pkg,
    module: 'src/index.ts',
    // webpack externals options
    dependencies: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
  });
  return conf;
};
