module.exports = {
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "https://code.bakerychu.com/api",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
