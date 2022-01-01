import FS from 'fs-extra';
import { Configuration } from 'webpack';
import { LoaderConfOptions } from '../utils/loaderConf';

/**
 * sourceMap source file does not exist #325
 * https://github.com/kktjs/kkt/issues/325
 */
export function loadSourceMapWarnning(
  conf: Configuration,
  env: 'development' | 'production',
  options: LoaderConfOptions,
) {
  if (conf.module && conf.module.rules && conf.module.rules[0]) {
    const rules = conf.module.rules[0];
    if (typeof rules === 'object' && typeof rules.loader === 'string' && /source-map-loader/.test(rules.loader)) {
      // ;(conf.module.rules[0] as any).exclude = /((@babel(?:\/|\\{1,2})runtime)|codesandbox-import-utils)/;
      (conf.module.rules[0] as any).options = {
        filterSourceMappingUrl: (url: string, resourcePath: string) => {
          if (/\.(js|mjs|jsx|ts|tsx|css)$/.test(resourcePath) && !FS.existsSync(resourcePath)) {
            return 'skip';
          }
          return true;
        },
      };
    }
  }
  return conf;
}
