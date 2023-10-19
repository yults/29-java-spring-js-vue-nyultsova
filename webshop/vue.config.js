const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
      ? '/29-java-spring-js-vue-nyultsova/'
      : '/'
}