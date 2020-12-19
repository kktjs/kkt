declare module 'react-dev-utils/errorOverlayMiddleware' {
  import { RequestHandler } from 'express';
  function errorOverlayMiddleware(): RequestHandler;
  export default errorOverlayMiddleware
}

declare module 'react-dev-utils/evalSourceMapMiddleware' {
  import { Handler } from 'express';
  import WebpackDevServer from 'webpack-dev-server'

  /*
   * Middleware responsible for retrieving a generated source
   * Receives a webpack internal url: "webpack-internal:///<module-id>"
   * Returns a generated source: "<source-text><sourceMappingURL><sourceURL>"
   */
  function createEvalSourceMapMiddleware(server: WebpackDevServer): Handler;
  export default createEvalSourceMapMiddleware;
}