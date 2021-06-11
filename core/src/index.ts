import { Configuration } from 'webpack';
import { ParsedArgs } from 'minimist';

export * from './overrides/paths';
export * from './utils/loaderConf';
export * from './utils/getStyleLoaders';
export * from './utils/path';

export interface BuildArgs extends ParsedArgs {
  overridesWebpack?: (conf: Configuration) => Configuration;
}

export interface StartArgs extends BuildArgs {}
export interface TestArgs extends ParsedArgs {}
