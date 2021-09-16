/*
 * @Author: Broli
 * @Email: broli.up.up.up@gmail.com
 * @Date: 2021-09-16 18:29:30
 * @LastEditors: Broli
 * @LastEditTime: 2021-09-16 21:11:38
 * @Description: dll for react & react-dom & react-router
 */

const path = require('path');
const { DllPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = env => {
  let terminal;

  // base
  const baseConf = {
    entry: {
      react: ['react', 'react-dom'],
      // redux: ['redux', 'react-redux', 'redux-thunk'],
      react_router: ['react-router', 'react-router-dom']
    }
  };

  // development config
  const devConf = {
    mode: 'development',
    output: {
      filename: '[name].dll.js',
      path: path.resolve(__dirname, 'dll_dev'), // 绝对路径
      library: '_dll_[name]'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DllPlugin({
        context: __dirname,
        name: '_dll_[name]',
        path: path.join(__dirname, 'dll_dev', '[name].manifest.json')
      })
    ]
  };

  // production config
  const proConf = {
    mode: 'production',
    output: {
      filename: '[name].dll.js',
      path: path.resolve(__dirname, 'dll_pro'), // 绝对路径
      library: '_dll_[name]'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DllPlugin({
        context: __dirname,
        name: '_dll_[name]',
        path: path.join(__dirname, 'dll_pro', '[name].manifest.json')
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.js$/i,
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        })
      ]
    }
  };

  // console.log('dll env => ', env.NODE_ENV);

  // 区分环境
  if (env.NODE_ENV === 'dev') {
    terminal = { ...baseConf, ...devConf };
  } else {
    terminal = { ...baseConf, ...proConf };
  }
  return terminal;
};

