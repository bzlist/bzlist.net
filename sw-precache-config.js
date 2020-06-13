module.exports = {
  stripPrefix: "build/",
  staticFileGlobs: [
    "build/*.html",
    "build/manifest.webmanifest",
    "build/static/**/!(*map*)",
    "build/images/servers/default.png",
    "build/images/servers/*.webp",
    "build/favicon.ico"
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
