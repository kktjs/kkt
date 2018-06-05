const PATH = require('path');
const FS = require('fs');

// 确保在项目文件夹中的任何符号都解决了：
const appDirectory = FS.realpathSync(process.cwd());
// const toolDirectory = FS.realpathSync(__dirname);
// 项目 所在目录
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath);
// kkt 工具所在目录
// const resolveTool = relativePath => PATH.resolve(toolDirectory, relativePath);
// const appMockAPI = relativePath => PATH.resolve(appDirectory, relativePath);

function getKKTRCPath(_path) {
  const pathRc = resolveApp(_path);
  if (!FS.existsSync(pathRc)) {
    return null;
  }
  return pathRc;
}

module.exports = {
  resolveApp,
  appDirectory,
  appMockAPI: resolveApp('.kktmock.js'),
  appKKTRC: getKKTRCPath('.kktrc.js'),
  appBuildDist: resolveApp('dist'),
  appPublicPath: '/',
  appIndex: resolveApp('src/index.js'),
  defaultHTMLPath: resolveApp('public/index.html'),
};
