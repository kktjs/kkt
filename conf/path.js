const PATH = require('path');
const FS = require('fs');

// 确保在项目文件夹中的任何符号都解决了：
const appDirectory = FS.realpathSync(process.cwd());
// const toolDirectory = FS.realpathSync(__dirname);
// Markdown 所在目录
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath);
// rdoc 工具所在目录
// const resolveTool = relativePath => PATH.resolve(toolDirectory, relativePath);

module.exports = {
  resolveApp,
  appDirectory,
  appBuildDist: resolveApp('dist'),
  appPublicPath: '/',
  appIndex: resolveApp('src/index.js'),
  defaultHTMLPath: resolveApp('public/index.html'),
};
