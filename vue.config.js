const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0',
  },
})
