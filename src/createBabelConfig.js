// @flow
import path from 'path'

import {typeOf} from './utils'

type BabelPluginConfig = string | [string, Object];

type BabelConfig = {
  presets: BabelPluginConfig[],
  plugins?: BabelPluginConfig[],
};

type BuildOptions = {
  commonJSInterop?: boolean,
  env?: Object,
  modules?: false | string,
  plugins?: BabelPluginConfig[],
  presets?: string[],
  removePropTypes?: true | Object,
  setRuntimePath?: false,
  stage?: number,
  webpack?: boolean,
};

type UserOptions = {
  cherryPick?: string | string[],
  loose?: boolean,
  plugins?: BabelPluginConfig[],
  presets?: BabelPluginConfig[],
  reactConstantElements?: boolean,
  removePropTypes?: false | Object,
  runtime?: boolean | string,
  stage?: false | number,
};

const DEFAULT_STAGE = 2
const RUNTIME_PATH = path.dirname(require.resolve('babel-runtime/package'))

export default function createBabelConfig(
  buildConfig: BuildOptions = {},
  userConfig: UserOptions = {}
): BabelConfig {
  let {
    commonJSInterop,
    modules = false,
    plugins: buildPlugins = [],
    presets: buildPresets,
    removePropTypes: buildRemovePropTypes = false,
    setRuntimePath,
    stage: buildStage = DEFAULT_STAGE,
    webpack = true,
  } = buildConfig

  let {
    cherryPick,
    loose,
    plugins: userPlugins = [],
    presets: userPresets,
    reactConstantElements,
    removePropTypes: userRemovePropTypes,
    runtime: userRuntime,
    stage: userStage,
  } = userConfig

  let presets: BabelPluginConfig[] = []
  let plugins: BabelPluginConfig[] = []

  // 默认为loose模式，除非明确配置
  if (typeOf(loose) === 'undefined') {
    loose = true
  }

  // ES2015 和 ES2016 预置
  presets.push(
    [require.resolve('babel-preset-es2015'), {loose, modules}],
    require.resolve('babel-preset-es2016'),
  )
  // Babel 6的stage-3预设包含所有es2017插件，因此如果用户已禁用使用stage预设，则只能使用es2017预设。
  if (userStage === false) {
    presets.push(require.resolve('babel-preset-es2017'))
  }

  // 附加构建预设
  if (Array.isArray(buildPresets)) {
    buildPresets.forEach(preset => {
      // 可以通过用户配置进行配置的预设名称，因此可在此模块中处理定制。
      if (preset === 'react-prod') {
        // 将React JSX元素视为值类型，并将其提升到最高的范围
        if (reactConstantElements !== false) {
          plugins.push(require.resolve('babel-plugin-transform-react-constant-elements'))
        }
        // 删除或包装propTypes并可选择删除prop-types导入
        if (userRemovePropTypes !== false) {
          plugins.push([
            require.resolve('babel-plugin-transform-react-remove-prop-types'),
            typeof userRemovePropTypes === 'object' ? userRemovePropTypes : {}
          ])
        }
      }
      // 假设所有其他预设是到预设模块的路径
      else {
        presets.push(preset)
      }
    })
  }

  // Stage preset
  let stage = userStage != null ? userStage : buildStage
  if (typeof stage == 'number') {
    presets.push(require.resolve(`babel-preset-stage-${stage}`))
    // 装饰器是stage 2，但是Babel不支持 - 在此期间添加传统的转换支持。
    if (stage <= 2) {
      plugins.push(require.resolve('babel-plugin-transform-decorators-legacy'))
    }
  }

  if (userPresets) {
    presets = presets.concat(userPresets)
  }

  let config: BabelConfig = {presets}

  plugins = plugins.concat(buildPlugins, userPlugins)

  // 应用程序构建使用“react-prod”预置来remove/wrap propTypes，组件构建使用此配置。
  if (buildRemovePropTypes) {
    // 用户配置可以禁用protoTypes
    if (userRemovePropTypes !== false) {
      plugins.push(
        [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
          ...typeof buildRemovePropTypes === 'object' ? buildRemovePropTypes : {},
          ...typeof userRemovePropTypes === 'object' ? userRemovePropTypes : {}
        }]
      )
    }
  }

  // Runtime变量根据使用情况将各种东西导入模块。
  // 默认情况下打开再生器，以启用使用async / await和generator 没有配置。
  let runtimeTransformOptions: Object = {
    helpers: false,
    polyfill: false,
    regenerator: true,
  }
  if (setRuntimePath !== false) {
    runtimeTransformOptions.moduleName = RUNTIME_PATH
  }
  if (userRuntime !== false) {
    if (userRuntime === true) {
      // 启用所有功能
      runtimeTransformOptions = {}
      if (setRuntimePath !== false) {
        runtimeTransformOptions.moduleName = RUNTIME_PATH
      }
    }else if (typeOf(userRuntime) === 'string') {
      // 启用命名功能
      runtimeTransformOptions[userRuntime] = true
    }
    plugins.push([require.resolve('babel-plugin-transform-runtime'), runtimeTransformOptions])
  }

  // 允许Babel在与Webpack一起使用时解析（但不能转换）import（）
  if (webpack) {
    plugins.push(require.resolve('babel-plugin-syntax-dynamic-import'))
  }

  // 提供CommonJS interop，这样用户就不必在它们的导入中标记一个.default，如果他们使用了vanilla Node.js require（）。
  if (commonJSInterop) {
    plugins.push(require.resolve('babel-plugin-add-module-exports'))
  }

  // lodash插件支持命名模块的通用樱桃拣选
  if (cherryPick) {
    plugins.push([require.resolve('babel-plugin-lodash'), {id: cherryPick}])
  }

  if (plugins.length > 0) {
    config.plugins = plugins
  }

  return config
}
