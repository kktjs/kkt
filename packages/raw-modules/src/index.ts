import { Configuration, RuleSetRule, RuleSetCondition } from 'webpack';
import { ParsedArgs } from 'minimist';

export type ReactLibraryOptions = ParsedArgs & {
  test?: RuleSetCondition;
  esModule?: boolean;
}

/**
 * Makes it easy to use the webpack raw-loader
 */
const rawModules = (conf: Configuration, env: string, options = {} as ReactLibraryOptions): Configuration => {
  const { test = /\.md$/i, esModule = true } = options;
  const loaders: RuleSetRule[] = [{
    test,
    use: [
      {
        loader: require.resolve('raw-loader'),
        options: { esModule },
      }
    ]
  }];
  // Exclude all less files (including module files) from file-loader
  conf.module.rules = conf.module.rules.map((rule) => {
    if (rule.oneOf) {
      rule.oneOf = loaders.concat(rule.oneOf);
    }
    return rule;
  });
  return conf
}

export default rawModules;
