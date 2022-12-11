import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import resolvePackagePath from 'resolve-package-path';
import { DevServerOptions } from '../utils/loaderConf';
import { StartArgs } from '..';

/**
 * Specify a static service, which can be used for document preview
 * @param conf
 */
export const staticDocSetupMiddlewares = (
  middlewares: WebpackDevServer.Middleware[],
  devServer: WebpackDevServer,
  options: StartArgs & DevServerOptions,
) => {
  if (options.docs) {
    let dirPath = options.docs;
    let route = '/_doc';
    if (dirPath?.includes(':')) {
      const arr = dirPath.split(':');
      dirPath = arr[0];
      route = arr[1];
    }
    if (!route.startsWith('/')) {
      route = '/' + route;
    }
    const [_, name] = dirPath.match(/^([a-zA-Z]+|@[a-zA-Z]+\/[a-zA-Z]+)\/?/i);
    const pkgPath = resolvePackagePath(name, process.cwd());
    const docRoot = path.resolve(
      path.dirname(pkgPath).replace(new RegExp(`${name.replace('/', path.sep)}$`, 'ig'), ''),
      dirPath,
    );
    devServer.app.use(route, express.static(docRoot));
  }
  return middlewares;
};
