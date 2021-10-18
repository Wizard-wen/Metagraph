// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
// const productionGzipExtensions = ['js', 'css'];

module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|ts|scss)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8 // 压缩比
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      const externals = {
        'antv-x6': 'AntvX6',
      };
      config.externals(externals);
      const cdn = {
        css: [
          // element-ui css
          // 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.12.0/theme-chalk/index.css'
        ],
        js: [
          // antv-x6
          'https://cdn.jsdelivr.net/npm/@antv/x6@1.26.2/dist/x6.js'
        ]
      };
      // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
      config.plugin('html')
        .tap((args) => {
          args[0].cdn = cdn;
          return args;
        });
    }
  },
  // 是否启用eslint
  lintOnSave: false,
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    // 以上的ip和端口是我们本机的;下面为需要跨域的
    // proxy: { // 配置跨域
    // '/': {
    //   target: 'http://localhost:7250/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
    //   // ws: true,
    //   changOrigin: true, // 允许跨域
    //   pathRewrite: {
    //     '^/': ''// 请求的时候使用这个api就可以
    //   }
    // },
    // '/websocket': {
    //   target: 'http://localhost:8089/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
    //   ws: true,
    //   changOrigin: true, // 允许跨域
    //   pathRewrite: {
    //     '^/': ''// 请求的时候使用这个api就可以
    //   }
    // },
    // '/': {
    //   target: 'http://edu.songxiwen.com.cn/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
    //   ws: true,
    //   changOrigin: true, // 允许跨域
    //   pathRewrite: {
    //     '^/': ''// 请求的时候使用这个api就可以
    //   }
    // }
    // }
  }
};
