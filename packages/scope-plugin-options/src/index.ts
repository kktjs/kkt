import { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';

export type ReactLibraryOptions = LoaderConfOptions & {
  allowedFiles?: ReadonlyArray<string>;
};

const regexp = /(ModuleScopePlugin)/;

export default (conf: Configuration, env: string, options = {} as ReactLibraryOptions): Configuration => {
  if (!conf) {
    throw Error('KKT:ConfigPaths: there is no config file found');
  }
  const { allowedFiles } = options;
  const moduleScopePlugin = conf.resolve.plugins.find(
    (plugin) => plugin.constructor && plugin.constructor.name && regexp.test(plugin.constructor.name),
  );
  if (moduleScopePlugin && allowedFiles && Array.isArray(allowedFiles) && allowedFiles.length > 0) {
    allowedFiles.forEach((keyName) => {
      // Add our extra file path(s). Each file needs to be individually added to the
      // allowedFiles property (globs will not work).
      (moduleScopePlugin as any).allowedFiles.add(keyName);
    });
  }

  return conf;
};
