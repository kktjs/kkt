import { Argv } from 'yargs';
import handlerBuild from './handlerBuild';

export const command = 'build [options]';
export const describe = 'Builds the app for production to the dist folder.';

export function builder(yarg: Argv) {
  return yarg.option({
    emptyDir: {
      alias: 'e',
      describe: 'Empty the DIST directory before compiling.',
      default: true,
    },
    checkRequiredFiles: {
      describe: 'Warn and crash if required files are missing.',
      default: true,
    }
  })
  .example('$ kkt build ', 'Build your project.')
  .example('$ kkt build --no-emptyDir', 'Build your project.');
}

export const handler = handlerBuild;