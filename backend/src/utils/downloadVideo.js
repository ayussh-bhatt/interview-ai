import fs from "fs";
import https from "https";

export const downloadVideo = (videoUrl, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https
      .get(videoUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
  });
};
