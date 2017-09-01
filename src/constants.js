// 将配置放入 kkt.config.js 中
export const CONFIG_FILE_NAME = 'kkt.config.js'

export const DEFAULT_PORT = process.env.PORT || 3333

export const WEB_APP = 'web-app'
export const REACT_APP = 'react-app'
export const REACT_COMPONENT = 'react-component'
export const WEB_MODULE = 'web-module'

export const PROJECT_TYPES = new Set([
  WEB_APP,
  WEB_MODULE,
  REACT_APP,
  REACT_COMPONENT,
])

export const APP_PROJECT_CONFIG = {
  [REACT_APP]: {
    dependencies: ['react', 'react-dom'],
  },
  [WEB_APP]: {},
}

const MODULE_PROJECT_CONFIG = {
  [REACT_COMPONENT]: {
    devDependencies: ['react', 'react-dom'],
    externals: {react: 'React'},
  },
  [WEB_MODULE]: {},
}