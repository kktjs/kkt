import fs from 'fs-extra';
import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import resolvePackagePath from 'resolve-package-path';
import { DevServerOptions, WebpackConfiguration } from '../utils/loaderConf';
import { StartArgs } from '..';

export interface DocsDataResult {
  /**
   * document root
   * E.g: '/Users/xxx/kkt/node_modules/@uiw/doc/web'
   */
  docRoot?: string;
  /**
   * Document Access Routing
   * E.g: http://192.168.4.35:3003/_doc
   */
  route?: string;
  /**
   * E.g: '/Users/xxx/kkt/node_modules/@uiw/doc/web/package.json'
   */
  pkgPath?: string;
  root?: string;
  /**
   * E.g: '@uiw/doc/web'
   */
  dirPath?: string;
  /**
   * E.g: '@uiw/doc'
   */
  name?: string;
  raw?: string;
}

export function getDocsData(str: string = '', route = '/_doc'): DocsDataResult {
  const result: DocsDataResult = { raw: str, route };
  let dirPath = str;
  if (dirPath?.includes(':')) {
    const arr = dirPath.split(':');
    result.dirPath = arr[0];
    result.route = arr[1] || route;
  }
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  // relative directory
  if (fs.existsSync(path.resolve(dirPath))) {
    result.docRoot = path.resolve(dirPath);
    result.pkgPath = resolvePackagePath(process.cwd(), process.cwd());
    const pkg = fs.readJSONSync(result.pkgPath);
    result.name = pkg.name;
    result.route = '/';
    return result;
  }

  const [_, name] = dirPath.match(/^([a-zA-Z\-]+|@[a-zA-Z\-]+\/[a-zA-Z\-]+)\/?/i);
  result.name = name;
  result.pkgPath = resolvePackagePath(name, process.cwd());
  result.root = path.dirname(result.pkgPath).replace(new RegExp(`${name.replace('/', path.sep)}$`, 'ig'), '');
  const [repath] = str.replace(name, '').split(':');
  result.docRoot = path.resolve(path.dirname(result.pkgPath) + repath);
  return { ...result };
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
