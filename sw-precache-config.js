module.exports = {
  stripPrefix: "build/",
  staticFileGlobs: [
    "build/*.html",
    "build/manifest.json",
    "build/static/**/!(*map*)",
    "build/*.ttf",
    "build/images/servers/default.png",
    "build/favicon.ico"
  ],
  navigateFallback: "/index.html",
  staticFileGlobsIgnorePatterns: [/\.map$/],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  minify: true,
  swFilePath: "build/service-worker.js"
};
