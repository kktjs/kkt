import { Argv } from 'yargs';
import path from 'path';
import color from 'colors-cli';
import fs from 'fs';
import * as jest from 'jest';
import { IMyYargsArgs } from '../../type/type';
import createJestConfig from '../../config/jest.config';
import * as paths from '../../config/paths';

export const command = 'test [options]';
export const describe = 'Run jest test runner in watch mode.';

export function builder(yarg: Argv) {
  return yarg.option({
    'coverage': {
      describe: 'Indicates that test coverage information should be collected and reported in the output.',
      type: 'boolean',
      default: false,
    },
    'env': {
      describe: 'The test environment used for all tests.',
      type: 'string',
      default: 'jsdom',
    },
    'config': {
      describe: 'The path to a Jest config file specifying how to find and execute tests.',
      type: 'string',
    },
  })
    .example('$ kkt test', 'Run test suites related')
    .example('$ kkt test --coverage', 'Test coverage information should be collected');
}

export interface ITestArgs extends IMyYargsArgs {
  env?: string;
  config?: string;
  coverage?: boolean;
}

export async function handler(args: ITestArgs) {
  const jestArgs: string[] = [];
  if (args.config) {
    const jestConfPath: string = path.join(args.sourceRoot as string, args.config);
    if (!fs.existsSync(jestConfPath)) {
      console.log(
        `\n Uh oh! Looks like there's your configuration does not exist.\n`,
        `Path: ${color.yellow(jestConfPath)}\n`
      );
      return;
    }
    if (fs.existsSync(jestConfPath)) {
      jestArgs.push(`--config=${jestConfPath}`);
    }
  }

  if (args.coverage) {
    jestArgs.push('--coverage');
  } else if (!process.env.CI) {
    jestArgs.push('--watchAll');
  }
  jestArgs.push(
    '--config',
    JSON.stringify(
      createJestConfig({
        env: args.env,
        rootDir: path.resolve(paths.appPath as string),
      })
    )
  );
  jest.run(jestArgs);
}