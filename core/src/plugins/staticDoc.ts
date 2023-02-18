import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import resolvePackagePath from 'resolve-package-path';
import { DevServerOptions, WebpackConfiguration } from '../utils/loaderConf';
import { StartArgs } from '..';

export function getDocsData(str: string = '', route = '/_doc') {
  let dirPath = str;
  if (dirPath?.includes(':')) {
    const arr = dirPath.split(':');
    dirPath = arr[0];
    route = arr[1] || route;
  }
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  const [_, name] = dirPath.match(/^([a-zA-Z\-]+|@[a-zA-Z\-]+\/[a-zA-Z\-]+)\/?/i);
  const pkgPath = resolvePackagePath(name, process.cwd());
  const root = path.dirname(pkgPath).replace(new RegExp(`${name.replace('/', path.sep)}$`, 'ig'), '');
  const [repath] = str.replace(name, '').split(':');
  const docRoot = path.resolve(path.dirname(pkgPath) + repath);
  return {
    name,
    route,
    dirPath,
    pkgPath,
    root,
    docRoot,
  };
}

/**
 * Specify a static service, which can be used for document preview
 * @param conf
 */
export const staticDocSetupMiddlewares = (
  middlewares: WebpackDevServer.Middleware[],
  devServer: WebpackDevServer,
  options: StartArgs & DevServerOptions & { config?: WebpackConfiguration },
) => {
  if (options.docs) {
    const { route, docRoot } = getDocsData(options.docs);
    let routePath = route;
    if (options.config?.output?.publicPath && typeof options.config.output.publicPath === 'string') {
      routePath = options.config.output.publicPath.replace(/\/+$/, '') + route;
    }
    devServer.app.use(routePath, express.static(docRoot));
  }
  return middlewares;
};
