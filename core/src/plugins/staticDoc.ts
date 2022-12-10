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
    const [_, name] = options.docs.match(/^([a-zA-Z]+|@[a-zA-Z]+\/[a-zA-Z]+)\/?/i);
    const pkgPath = resolvePackagePath(name, process.cwd());
    const docRoot = path.resolve(
      path.dirname(pkgPath).replace(new RegExp(`${name.replace('/', path.sep)}$`, 'ig'), ''),
      options.docs,
    );
    devServer.app.use('/_doc', express.static(docRoot));
  }
  return middlewares;
};
