/**
 * @author wizard
 * @date 2021/05/11 22:34
 */

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 该对象将会被 webpack-merge 合并入最终的 webpack 配置。
  configureWebpack: {
    plugins: [
      // 开启gzip压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|ts|scss)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8 // 压缩比
      })
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        // minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      }
    },
  },
  chainWebpack: (config) => {

    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })

    if (process.env.NODE_ENV === 'production') {
      // key是package.json中安装的包名，
      // value时包真实注册或者说暴露的全局变量的值，
      const externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        '@antv/x6': 'X6',
        '@antv/g6': 'G6',
        'moment': 'moment'
      };
      config.externals(externals);
      const cdn = {
        css: [],
        js: [
          // vue
          // vue@next会重定向一次
          // 'https://unpkg.com/vue@next',
          // 'https://unpkg.com/vue@3.2.20/dist/vue.global.js',
          'https://unpkg.com/vue@3.2.20/dist/vue.global.prod.js',
          // vue router
          'https://unpkg.com/vue-router@4.0.12/dist/vue-router.global.prod.js',
          // vuex
          'https://unpkg.com/vuex@4.0.2/dist/vuex.global.prod.js',
          // @antv/x6
          // 'https://cdn.jsdelivr.net/npm/@antv/x6@1.28.1/dist/x6.js',
          'https://gw.alipayobjects.com/os/lib/antv/x6/1.28.1/dist/x6.js',
          // @antv/g6
          'https://gw.alipayobjects.com/os/lib/antv/g6/4.3.11/dist/g6.min.js',
          // moment
          'https://file.songxiwen.com.cn/metagraph-static/moment.min.js'
          // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.25.1/moment.min.js',
          // 'https://cdn.jsdelivr.net/npm/moment@2.25.1/moment.min.js'
        ]
      };
      // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
      config.plugin('html')
        .tap((args) => {
          args[0].cdn = cdn;
          return args;
        });
    }
    if (process.env.NODE_ENV === 'production') {
      // 生成打包报告
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }
  },
  // 是否启用eslint
  lintOnSave: false,
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: true,
    hot: true,
    host: '0.0.0.0',
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
  }
};
