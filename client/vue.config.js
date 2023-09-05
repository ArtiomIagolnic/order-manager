const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      runtimeChunk: "single",
    },
  },
  outputDir: 'dist',
});
