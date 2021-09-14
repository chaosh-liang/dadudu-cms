const path = require('path');
const { whenProd, whenDev } = require('@craco/craco');
const TerserPlugin = require('terser-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    plugins: [
      new SimpleProgressWebpackPlugin(), // 查看打包的进度
    ],
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = 'dist';
      webpackConfig.devServer = whenDev(
        () => ({
          host: '0.0.0.0',
          useLocalIp: true,
          proxy: {
            '/dadudu/api': {
              // url 会自动补全：`${target}/dadudu/api`
              target: 'http://localhost:7716',
              secure: false,
              changeOrigin: true,
            },
          },
        }),
        webpackConfig.devServer
      );
      webpackConfig.devtool = whenProd(() => false, webpackConfig.devtool);
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: './',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[id].bundle.[hash:4].js',
        chunkFilename: 'js/[id].[chunkhash:6].js',
      };
      webpackConfig.optimization = {
        minimizer: whenProd(() => {
          return webpackConfig.optimization.minimizer.map((plugin) => {
            if (plugin instanceof TerserPlugin) {
              Object.assign(plugin.options.terserOptions.compress, {
                drop_debugger: true, // 删除 debugger
                drop_console: true, // 删除 console
              });
              Object.assign(plugin.options.terserOptions.format, {
                comments: false, // 删除注释
              });
            }
            return plugin;
          });
        }, webpackConfig.optimization.minimizer),
        splitChunks: {
          chunks: 'all',
          minSize: 200000, // 20k
          maxAsyncRequests: 9, // 最大异步请求数
          maxInitialRequests: 6, // 页面初始化最大异步请求数
          automaticNameDelimiter: '-', // 解决命名冲突
          // name: true值将会自动根据切割之前的代码块和缓存组键值(key)自动分配命名,否则就需要传入一个String或者function.
          name: true,
          cacheGroups: {
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              test: /[\\/]node_modules[\\/]/,
              priority: -11,
            },
            antd: {
              name: 'chunk-antd',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
              priority: -10,
            },
            echarts: {
              name: 'chunk-echarts',
              chunks: 'async',
              test: /[\\/]node_modules[\\/]echarts[\\/]/,
              priority: 1,
            },
            lodash: {
              name: 'chunk-lodash',
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              priority: 2,
              chunks: 'async',
            },
            axios: {
              name: 'chunk-axios',
              test: /[\\/]node_modules[\\/]axios[\\/]/,
              priority: 3,
              chunks: 'async',
            },
            moment: {
              name: 'chunk-moment',
              test: /[\\/]node_modules[\\/]moment[\\/]/,
              priority: 4,
              chunks: 'async',
            },
          },
        },
      };
      // console.log(webpackConfig);
      // console.log('环境 => ', env, paths);
      return webpackConfig;
    },
  },
};
