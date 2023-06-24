import { Configuration, RuleSetRule, RuleSetCondition } from 'webpack';
import { LoaderConfOptions } from 'kkt';

export type ReactLibraryOptions = LoaderConfOptions & {
  test?: RuleSetCondition;
  esModule?: boolean;
};

/**
 * Makes it easy to use the webpack raw-loader
 */
const rawModules = (conf: Configuration, env: string, options = {} as ReactLibraryOptions): Configuration => {
  if (!conf) {
    throw Error('KKT:ConfigPaths: there is no config file found');
  }
  const { test = /\.md$/i, esModule = true } = options;
  const loaders: RuleSetRule[] = [
    {
      test,
      use: [
        {
          loader: require.resolve('raw-loader'),
          options: { esModule },
        },
      ],
    },
  ];
  // Exclude all less files (including module files) from file-loader
  conf.module.rules = conf.module.rules.map((rule) => {
    if (typeof rule === 'object' && rule.oneOf && Array.isArray(rule.oneOf)) {
      rule.oneOf = [...loaders, ...rule.oneOf];
    }
    return rule;
  });
  return conf;
};

export default rawModules;
