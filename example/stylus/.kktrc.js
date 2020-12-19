import stylusModules from '@kkt/stylus-modules';

export default (conf, env, options) => {
  conf = stylusModules(conf, env, options);
  return conf;
}