const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // 这里的 devServer.app 就是 express 实例
      registerRouter(devServer.app)
      return middlewares
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/music-next-main/'  // 替换成你的仓库名
    : '/',
  outputDir: 'dist',  // 打包到 dist
  productionSourceMap: false
})
