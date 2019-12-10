import fs, { PathLike } from 'fs-extra';
import path from 'path';
import url from 'url';

export type ResolveApp = (relativePath: string) => string;

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp: ResolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath: string, needsSlash: boolean) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

function getPublicUrl(appPackageJson: PathLike): string {
  if (envPublicUrl) return envPublicUrl;
  if (!fs.existsSync(appPackageJson)) return '';
  return require(appPackageJson as string).homepage
}

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson: PathLike): string {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions: string[] = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];


// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn: ResolveApp, filePath: string) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.js`);
};

const ENTRYDIR = process.env.ENTRYDIR || 'src';

const dotenv = resolveApp('.env');
const appPath = resolveApp('.');
const appBuild = resolveApp('build');
const appPublic = resolveApp('public');
const appHtml = resolveApp('public/index.html');
const appIndexJs = resolveModule(resolveApp, `${ENTRYDIR}/index`);
const appPackageJson = resolveApp('package.json');
const appSrc = resolveApp(ENTRYDIR);
const appKKTRC = resolveApp('.kktrc.js');
const appTsConfig = resolveApp('tsconfig.json');
const appJsConfig = resolveApp('jsconfig.json');
const yarnLockFile = resolveApp('yarn.lock');
const testsSetup = resolveModule(resolveApp, `${ENTRYDIR}/setupTests`);
const proxySetup = resolveApp(`${ENTRYDIR}/setupProxy.js`);
const appNodeModules = resolveApp('node_modules');
const publicUrl = getPublicUrl(resolveApp('package.json'));
const servedPath = getServedPath(resolveApp('package.json'));

export {
  dotenv,
  appPath,
  appBuild,
  appPublic,
  appHtml,
  appIndexJs,
  appPackageJson,
  appSrc,
  appKKTRC,
  appTsConfig,
  appJsConfig,
  yarnLockFile,
  testsSetup,
  proxySetup,
  appNodeModules,
  publicUrl,
  servedPath,
  // --->
  moduleFileExtensions,
};

