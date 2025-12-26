import favicons from "favicons";
import fs from "fs";

const source = "public/logo/favicon_logo.jpg"; // your source image

const configuration = {
  path: "/",
  appName: "Flowwa",
  icons: {
    android: true,
    appleIcon: true,
    favicons: true,
  },
};

favicons(source, configuration)
  .then((response) => {
    response.images.forEach((image) => {
      fs.writeFileSync(
        `public/logo/Generated_favicons/${image.name}`,
        image.contents
      );
    });
    response.files.forEach((file) => {
      fs.writeFileSync(
        `public/logo/Generated_favicons/${file.name}`,
        file.contents
      );
    });
    console.log("Favicons generated!");
  })
  .catch(console.error);
