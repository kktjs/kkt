process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

require('../../config/env');

import fs from 'fs';
import color from 'colors-cli/safe';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import clearConsole from 'react-dev-utils/clearConsole';
import openBrowser from 'react-dev-utils/openBrowser';
import { choosePort, createCompiler, prepareProxy, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import configFactory from '../../config/webpack.config';
import * as paths from '../../config/paths';
import { IMyYargsArgs } from '../../type/type';


// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
import { checkBrowsers } from 'react-dev-utils/browsersHelper';

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

export default async function (args: IMyYargsArgs) {
  // Tools like Cloud9 rely on this.
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || args.port || 19870;
  const HOST = process.env.HOST || '0.0.0.0';
  if (process.env.HOST) {
    console.log(
      color.cyan(
        `Attempting to bind to HOST environment variable: ${color.yellow(color.bold(process.env.HOST))}`
      )
    );
    console.log(
      `If this was unintentional, check that you haven't mistakenly set it in your shell.`
    );
    console.log();
  }
  try {
    await checkBrowsers(paths.appPath, isInteractive);
    const PORT = await choosePort(HOST, DEFAULT_PORT);
    args.host = HOST;
    args.port = PORT;
    const config = await configFactory('development', args);
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson as string).name;
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const urls = prepareUrls(protocol, HOST, PORT);
    const devSocket = {
      warnings: (warnings: string[]) => (devServer as any).sockWrite((devServer as any).sockets, 'warnings', warnings),
      errors: (errors: string[]) => (devServer as any).sockWrite((devServer as any).sockets, 'errors', errors),
    };
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      webpack,
    });
    const devServer = new WebpackDevServer(compiler, config.devServer as WebpackDevServer.Configuration);
    // Launch WebpackDevServer.
    devServer.listen(PORT, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }

      // We used to support resolving modules according to `NODE_PATH`.
      // This now has been deprecated in favor of jsconfig/tsconfig.json
      // This lets you use absolute paths in imports inside large monorepos:
      if (process.env.NODE_PATH) {
        console.log(
          color.yellow(
            'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
          )
        );
        console.log();
      }

      console.log(color.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig as NodeJS.Signals, () => {
        devServer.close();
        process.exit();
      });
    });
  } catch (error) {
    console.log('error:', error);
  }
}