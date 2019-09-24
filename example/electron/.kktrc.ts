export default (conf) => {
  conf.output.publicPath = '.';
  const regexp = /(GenerateSW)/;
  conf.plugins = conf.plugins.map((item) => {
    if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
      return null;
    }
    return item;
  }).filter(Boolean);
  /**
   * Do somthing
   */
  return conf;
}
