module.exports = {
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost/Coding-platform/CodingPlatform_api/public",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
