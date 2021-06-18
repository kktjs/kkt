// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

import { reactScripts } from '../utils/path';
import { overridePaths } from '../overrides/paths';
import { TestArgs } from '..';

export default async function test(argvs: TestArgs) {
  try {
    // Ensure environment variables are read.
    require(`${reactScripts}/config/env`);
    await overridePaths(argvs);
    // run original script
    require(`${reactScripts}/scripts/test`);
  } catch (error) {
    console.log('KKT:TEST:ERROR:', error);
  }
}
