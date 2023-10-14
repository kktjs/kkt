import { Configuration } from 'webpack';
import { LoaderConfOptions } from 'kkt';

export type ReactLibraryOptions = LoaderConfOptions & {
  allowedFiles?: ReadonlyArray<string>;
  allowedPaths?: ReadonlyArray<string>;
  appSrcs?: string | ReadonlyArray<string>;
};

const regexp = /(ModuleScopePlugin)/;

export function disableScopePlugin(conf: Configuration) {
  conf.resolve!.plugins = conf.resolve?.plugins
    ?.map((plugin) => {
      if (plugin && plugin.constructor && plugin.constructor.name && regexp.test(plugin.constructor.name)) {
        return undefined;
      }
      return plugin;
    })
    .filter(Boolean);
  return conf;
}

export default function scopePluginOptions(
  conf: Configuration,
  env: string,
  options: ReactLibraryOptions,
): Configuration {
  if (!conf) {
    throw Error('KKT:@kkt/scope-plugin-options: there is no config found');
  }
  const { allowedFiles, appSrcs, allowedPaths } = options || {};

  const moduleScopePlugin = conf.resolve?.plugins?.find(
    (plugin) => plugin?.constructor && plugin.constructor.name && regexp.test(plugin.constructor.name),
  );
  if (moduleScopePlugin && typeof moduleScopePlugin === 'object') {
    if (allowedFiles && Array.isArray(allowedFiles)) {
      allowedFiles.forEach((keyName) => moduleScopePlugin.allowedFiles.add(keyName));
    }
    if (appSrcs && Array.isArray(appSrcs)) {
      appSrcs.forEach((keyName) => moduleScopePlugin.appSrcs.push(keyName));
    }
    if (allowedPaths && Array.isArray(allowedPaths)) {
      allowedPaths.forEach((keyName) => moduleScopePlugin.allowedPaths.push(keyName));
    }
  }

  return conf;
}
