import reactLibrary from '@kkt/react-library';
import lessModules from '@kkt/less-modules';
import pkg from './package.json';

export default (conf, env, options) => {
  conf = lessModules(conf, env, options);
  conf = reactLibrary(conf, env, {
    ...options,
    ...pkg,
    // webpack externals options
    dependencies: {
      ...pkg.dependencies,
      "react-refresh": "0"
    }
  });
  return conf
}