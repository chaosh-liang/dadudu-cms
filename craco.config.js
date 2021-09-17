const fs = require('fs');
const path = require('path');
const { DllReferencePlugin } = require('webpack');
const { whenProd, whenDev } = require('@craco/craco');
// const TerserPlugin = require('terser-webpack-plugin');
// const safePostCssParser = require('postcss-safe-parser');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 判断编译环境是否为生产
// const isBuildAnalyzer = process.env.REACT_APP_BUILD_ANALYZER === 'true';

// console.log('打包 env => ', process.env.NODE_ENV);

// const isEnvProduction = process.env.NODE_ENV === 'production';
// const isEnvDevelopment = process.env.NODE_ENV === 'development';

// 代理，默认配置
let proxy = {
  '/api': {
    // url 会自动补全：`${target}/api`
    target: 'http://localhost:7716/cms/dadudu', // 本地服务
    // target: 'http://101.34.21.222/cms/dadudu', // 线上服务
    secure: false,
    changeOrigin: true,
  },
};

try {
  fs.accessSync(path.join(__dirname, 'local-proxy.js'));
  const localProxy = require('./local-proxy');
  proxy = localProxy;
} catch (error) {}

// dll 相关
/* const handleDllPlugins = () => {
  const dllSuffix = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';
  const files = fs.readdirSync(path.resolve(__dirname, `dll_${dllSuffix}`));

  return files
    .map((file_name) => {
      if (/\.dll.js$/.test(file_name)) {
        return new AddAssetHtmlWebpackPlugin({
          outputPath: 'dll',
          publicPath: './dll',
          filepath: path.resolve(__dirname, `dll_${dllSuffix}`, file_name),
        });
      }
      if (/\.manifest.json$/.test(file_name)) {
        return new DllReferencePlugin({
          manifest: path.resolve(__dirname, `dll_${dllSuffix}`, file_name),
        });
      }
      return null;
    })
    .filter((i) => i);
}; */

module.exports = {
  devServer: {
    host: '0.0.0.0',
    useLocalIp: true,
    proxy,
  },
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    plugins: [
      new SimpleProgressWebpackPlugin(), // 查看打包的进度
      ...whenProd(() => [new CleanWebpackPlugin()], []),
      ...whenDev(
        () => [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static', // html 文件方式输出编译分析
            analyzerPort: 3301,
            openAnalyzer: false,
            reportFilename: path.resolve(__dirname, `analyzer/index.html`),
          }),
        ],
        []
      ),
      // ...handleDllPlugins(), // TODO
    ],
    /* optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_debugger: true,
              drop_console: true,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
          },
          cssProcessorPluginOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                minifyFontValues: { removeQuotes: false },
              },
            ],
          },
        }),
      ],
      splitChunks: {
        name: true,
        chunks: 'all',
        minSize: 200000, // chunk 大于 20k 才会被拆分
        maxAsyncRequests: 9, // 最大异步请求数
        maxInitialRequests: 6, // 页面初始化最大异步请求数
        automaticNameDelimiter: '-', // 解决命名冲突
        cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 1,
          },
          antd: {
            name: 'chunk-antd',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
            priority: 2,
          },
          echarts: {
            name: 'chunk-echarts',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: 3,
          },
          lodash: {
            name: 'chunk-lodash',
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            priority: 4,
            chunks: 'all',
          },
          axios: {
            name: 'chunk-axios',
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            priority: 5,
            chunks: 'all',
          },
          moment: {
            name: 'chunk-moment',
            test: /[\\/]node_modules[\\/]moment[\\/]/,
            priority: 6,
            chunks: 'all',
          },
        },
      },
    }, */
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.devtool = whenProd(() => false, webpackConfig.devtool);
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: './',
        filename: 'js/[id].bundle.[hash:4].js',
        chunkFilename: 'js/[id].[chunkhash:6].js',
      };
      // console.dir(webpackConfig.optimization.splitChunks);
      // console.log('环境 => ', env, paths);
      return webpackConfig;
    },
  },
};
