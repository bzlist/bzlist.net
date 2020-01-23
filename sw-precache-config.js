module.exports = {
  stripPrefix: "build/",
  staticFileGlobs: [
    "build/*.html",
    "build/manifest.webmanifest",
    "build/sw-precache-functions.js",
    "build/static/**/!(*map*)",
    "build/images/servers/default.png",
    "build/favicon.ico"
  ],
  navigateFallback: "/index.html",
  staticFileGlobsIgnorePatterns: [/\.map$/],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  minify: true,
  swFilePath: "build/service-worker.js",
  importScripts: ["./sw-precache-functions.js"]
};
