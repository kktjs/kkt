import createBabelConfig from './createBabelConfig'
import fs from 'fs'
import path from 'path'
import debug from './debug'
import webpack from 'webpack'


let urlLoaderOptions = {
  // 默认情况下不要内嵌任何内容
  limit: 1,
  // 始终使用哈希来防止具有相同名称的文件导致问题
  name: '[name].[hash:8].[ext]',
}


const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = ()=>{

  return {
    module:{
      rules:[
        // {
        //   exclude: [
        //     /\.html$/,
        //     /\.(js|jsx)$/,
        //     /\.css$/,
        //     /\.less$/,
        //     /\.json$/,
        //     /\.bmp$/,
        //     /\.gif$/,
        //     /\.jpe?g$/,
        //     /\.png$/,
        //   ],
        //   loader: require.resolve('file-loader'),
        //   options: {
        //     name: '[name].[hash:8].[ext]',
        //   },
        // },
        {
          test:  /\.js$/,
          // name:"js",
          include: resolveApp('src'),
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options:{ 
              babelrc: false,
              cacheDirectory: true,
          }
        },{ 
          test: /\.(gif|png|webp)$/,
          // name:"graphics",
          loader: require.resolve('url-loader'),
          options: { 
            limit: 10000, 
            name: '[name].[hash:8].[ext]' 
          } 
        },{ 
          test: /\.jpe?g$/,
          // name:"jpeg",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions}
        },{ 
          test: /\.svg$/,
          // name:"svg",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions} 
        },{ 
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          // name:"fonts",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions}  
        },{ 
          test: /\.(mp4|ogg|webm)$/,
          // name:"video",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions}  
        },{ 
          test: /\.(wav|mp3|m4a|aac|oga)$/,
          // name:"audio",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions}  
        },{ 
          test: /\.css$/,
          // name:"css",
          loader: require.resolve('url-loader'),
          options: {...urlLoaderOptions}  
        }
      ]
    }
  }
  plugins:[

  ]
}