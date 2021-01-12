import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';

export default (conf, env, options) => {
  // console.log('conf:', conf)
  // console.log('env:', env)
  conf = rawModules(conf, env, options);
  conf = lessModules(conf, env, options);
  return conf;
};
