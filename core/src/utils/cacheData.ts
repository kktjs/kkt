import { KKTRC } from './loaderConf';

type CacheData = {
  proxySetup?: KKTRC['proxySetup'];
} & Record<string, any>;

let data: CacheData = {};

/**
 * Cache data
 */
export const cacheData = (ops: CacheData) => {
  Object.keys(ops).forEach((keyname: keyof CacheData) => {
    data[keyname] = ops[keyname];
  });
};

/**
 * Get cache data
 */
export const getCacheData = (keyName?: keyof CacheData) => {
  if (keyName) {
    return data[keyName]
  }
  return data;
};
