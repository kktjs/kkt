import { IMyYargsArgs } from '../../type/type';

export const command = 'create <app-name> [options]';
export const describe = 'create a new project powered by kkt.';

export async function builder(yarg: IMyYargsArgs) {
  return yarg.option({
    example: {
      alias: 'e',
      describe: 'Example from https://github.com/kktjs/kkt/tree/master/example example-path',
      type: 'string',
      default: 'default',
    },
    registry: {
      alias: 'r',
      describe: 'Use specified npm registry when installing dependencies (only for npm)',
      type: 'string',
    },
  })
    .example('$ kkt create my-app ', 'Create my project.')
    .example('$ kkt create my-app --example rematch', 'Create an rematch example project.')
    .example('$ kkt create my-app -e rematch', 'Create an rematch example project.');
}