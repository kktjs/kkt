import color from 'colors-cli';
import { IMyYargsArgs } from '../../type/type';
import start from './start';

export const command = 'start [options]';
export const describe = 'Will create a web server, Runs the app in development mode.';

export function builder(yarg: IMyYargsArgs) {
  return yarg.option({
    emptyDir: {
      alias: 'e',
      describe: 'Empty the DIST directory before compiling.',
      default: true,
    },
  })
    .example(`$ ${color.green('kkt')} start `, 'Runs the app in development mode.')
    .example(`$ ${color.green('kkt')} start --emptyDir`, 'Build your project.');
}

export const handler = start;
