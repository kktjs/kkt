
import { Urls } from 'react-dev-utils/WebpackDevServerUtils';

declare module 'react-dev-utils/WebpackDevServerUtils' {
  
  /**
   * Returns an object with local and remote URLs for the development server.
   * Pass this object to `createCompiler()` described above.
   */
  export function prepareUrls(protocol: string, host: string, port: number, servedPathname: string): Urls;

}
