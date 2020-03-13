const imagemin = require("imagemin");
const webp = require("imagemin-webp");

imagemin(["build/images/servers/*.png"], {
  destination: "build/images/servers",
  plugins: [webp({
    quality: 85
  })]
}).then(() => console.log("Images converted to webp"));
