import { ParsedArgs } from 'minimist';
import { WebpackConfiguration } from './utils/loaderConf';

export * from './overrides/paths';
export * from './utils/loaderConf';
export * from './utils/getStyleLoaders';
export * from './plugins/miniCssExtractPlugin';
export * from './utils/path';

export interface BuildArgs extends ParsedArgs {
  overridesWebpack?: (conf: WebpackConfiguration) => WebpackConfiguration;
}

export interface StartArgs extends BuildArgs {}
export interface TestArgs extends ParsedArgs {}
