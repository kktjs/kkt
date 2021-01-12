import express from 'express';
import apiMocker from 'mocker-api';
import { getCacheData } from './cacheData';

/**
 * [Configuring the Proxy Manually](https://github.com/facebook/create-react-app/blob/3f699fd08044de9ab0ce1991a66b376d3e1956a8/docusaurus/docs/proxying-api-requests-in-development.md#configuring-the-proxy-manually),
 * The default is in the `src/setupProxy.js` directory, and now it is processed in `.kktrc.js` or `.kktrc.ts` through a special method.
 */
export default (app: express.Application) => {
  const { proxySetup } = getCacheData();
  if (proxySetup) {
    const opts = proxySetup(app);
    if (opts && opts.path) {
      apiMocker(app, opts.path, { ...opts.option });
    }
  }
};
