import FS from 'fs-extra';
import path from 'path';
import { Configuration } from 'webpack';
import { LoaderConfOptions } from '../utils/loaderConf';

/**
 * sourceMap source file does not exist #325
 * https://github.com/kktjs/kkt/issues/325
 */
export function loadSourceMapWarnning(conf: Configuration) {
  if (conf.module && conf.module.rules && conf.module.rules[0]) {
    const rules = conf.module.rules[0];
    if (typeof rules === 'object' && typeof rules.loader === 'string' && /source-map-loader/.test(rules.loader)) {
      // ;(conf.module.rules[0] as any).exclude = /((@babel(?:\/|\\{1,2})runtime)|codesandbox-import-utils)/;
      (conf.module.rules[0] as any).options = {
        filterSourceMappingUrl: (url: string, resourcePath: string) => {
          const sourceMapPath = path.join(path.dirname(resourcePath), url);
          if (FS.existsSync(sourceMapPath)) {
            const { sources = [] } = FS.readJsonSync(sourceMapPath);
            if (Array.isArray(sources) && sources.length > 0) {
              const isexists = sources
                .map((item: string) => FS.existsSync(path.resolve(path.dirname(resourcePath), item)))
                .find((item) => item === false);
              if (isexists === false) {
                return 'skip';
              }
            }
          }
          return true;
        },
      };
    }
  }
  return conf;
}
