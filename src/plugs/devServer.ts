import { Configuration } from 'webpack';
import { OptionConf } from '../config/webpack.config';
import * as paths from '../config/paths';

import { prepareProxy, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import createDevServerConfig from '../config/webpack.config.server';

module.exports = (conf: Configuration, options: OptionConf) => {
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const urls = prepareUrls(protocol, options.yargsArgs.host || '0.0.0.0', options.yargsArgs.port);
  // Load proxy config
  const proxySetting = require(paths.appPackageJson).proxy;
  const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
  conf.devServer = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
  return conf;
}