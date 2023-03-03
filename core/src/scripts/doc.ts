import path from 'path';
import fs from 'fs-extra';
import express from 'express';
import { getDocsData } from '../plugins/staticDoc';
import { BuildArgs } from '..';
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';

const app = express();

const HOST = process.env.DOC_HOST || '0.0.0.0';
const protocol = process.env.DOC_HTTPS === 'true' ? 'https' : 'http';

export interface DocsArgs extends BuildArgs {
  path?: string;
  port?: number;
}

export default async function docs(argv: DocsArgs) {
  try {
    const { route, docRoot, dirPath, ...other } = getDocsData(argv.path, '/');
    app.use(route, express.static(docRoot), (req, res, next) => {
      const content = fs.readFileSync(path.resolve(docRoot, './index.html'));
      res.send(content.toString());
      next();
    });
    const DEFAULT_PORT = parseInt(process.env.DOC_PORT, 10) || argv.port || 3002;
    const port = await choosePort(HOST, DEFAULT_PORT);
    app.listen(port, () => {
      const urls = prepareUrls(
        protocol,
        HOST,
        port,
        // @ts-ignore
        route,
      );
      console.log(`You can now view \x1b[37;1m${dirPath}\x1b[0m in the browser.`);
      console.log(`   Local:            ${urls.lanUrlForTerminal}`);
      console.log(`   On Your Network:  ${urls.localUrlForTerminal}`);
    });
  } catch (error) {
    const message = error && error.message ? error.message : '';
    console.log('\x1b[31;1m KKT:DOC:ERROR: \x1b[0m\n', error);
    new Error(`KKT:BUILD:ERROR: \n ${message}`);
    process.exit(1);
  }
}
