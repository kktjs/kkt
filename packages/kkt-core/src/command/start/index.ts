import color from 'colors-cli';
import { Argv } from 'yargs';
import start from './start';

export const command = 'start [options]';
export const describe = 'Will create a web server, Runs the app in development mode.';

export function builder(yarg: Argv) {
  return yarg.option({
    emptyDir: {
      alias: 'e',
      describe: 'Empty the DIST directory before compiling.',
      default: true,
    },
    // entryDir: {
    //   describe: 'The name of the Entry Points directory folder.',
    //   default: 'src',
    // },
    port: {
      describe: 'port.',
      type: 'number',
      default: 19870
    }
  })
    .example(`$ ${color.green('kkt')} start `, 'Runs the app in development mode.')
    .example(`$ ${color.green('kkt')} start --emptyDir`, 'Build your project.');
}

export const handler = start;
