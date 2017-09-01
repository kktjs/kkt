// @flow

function getBaseConfig() {
  return {}
}

function getDependencies() {
  return []
}

function getQuickConfig() {
  return {
    commandConfig: getBaseConfig(),
    defaultTitle: 'Web App',
  }
}

// JS 应用程序只需使用默认配置即可
export default (args: Object) => ({
  getName: () => 'Web',
  getProjectDependencies: getDependencies,
  getBuildDependencies: getDependencies,
  getBuildConfig: getBaseConfig,
  getServeConfig: getBaseConfig,
  getQuickDependencies: getDependencies,
  getQuickBuildConfig: getQuickConfig,
  getQuickServeConfig() {
    // Reload on unaccepted HMR changes by default; disable with --no-reload
    if (args.reload !== false) {
      args.reload = true
    }
    return getQuickConfig()
  },
  getKarmaTestConfig: getBaseConfig,
})
