import fs from 'fs';
import express from 'express';
import { paths } from 'kkt';
import { Configuration } from 'webpack';
import apiMocker, { MockerOption } from 'mocker-api';
import WebpackDevServer from 'webpack-dev-server';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';

/**
 * `mocker-api` that creates mocks for REST APIs. It will be helpful when you try to test your application without the actual REST API server.
 */
const mockerApiModules = (conf: WebpackDevServer.Configuration = {}, path: string | string[], option: MockerOption = {}) => {
  if (!conf) {
    throw Error('KKT:ConfigPaths: there is no config file found');
  }
  /**
   * 部分功能来源于 create-react-app 中复制
   * https://github.com/facebook/create-react-app/blob/282c03f9525fdf8061ffa1ec50dce89296d916bd/packages/react-scripts/config/webpackDevServer.config.js#L113-L125
   */
  conf.before = (app: express.Application, server: WebpackDevServer) => {
    // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
    // middlewares before `redirectServedPath` otherwise will not have any effect
    // This lets us fetch source contents from webpack for the error overlay
    app.use(evalSourceMapMiddleware(server));
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware());

    if (fs.existsSync(paths.proxySetup)) {
      // This registers user provided middleware for proxy reasons
      require(paths.proxySetup)(app);
    }
    if (path) {
      apiMocker(app, path, { ...option });
    }
  }
  return conf;
}

export default mockerApiModules;
