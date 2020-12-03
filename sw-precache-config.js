module.exports = {
  stripPrefix: "build/",
  staticFileGlobs: [
    "build/*.html",
    "build/manifest.webmanifest",
    "build/static/**/!(*map*)",
    "build/images/**/*",
    "build/favicon.*"
  ],
  runtimeCaching: [{
    urlPattern: "",
    handler: "networkFirst"
  }],
  navigateFallback: "/index.html",
  staticFileGlobsIgnorePatterns: [/\.map$/],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  minify: true,
  swFilePath: "build/service-worker.js"
};
