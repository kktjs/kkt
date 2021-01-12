import lessModules from '@kkt/less-modules';

export default (conf, env, options) => {
  conf = lessModules(conf, env, options);

  // with loaderOptions
  // conf = lessModules.withLoaderOptions({
  //   lessOptions: {
  //     modifyVars: {
  //       "@primary-color": "#1890ff",
  //     },
  //   }
  // })(conf, env, options);

  return conf;
};
