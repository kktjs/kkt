import { reactScripts, configOverrides } from '../utils/path';
import { KKTRC, loaderConf } from '../utils/loaderConf';

// load environment variables from `.env` files
// before overrides scripts are read
require(`${reactScripts}/config/env`);

export default async function config(): Promise<KKTRC> {
  return await loaderConf(configOverrides);
}
