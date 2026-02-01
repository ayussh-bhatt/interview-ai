import ffmpeg from "fluent-ffmpeg";

export const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .save(audioPath)
      .on("end", resolve)
      .on("error", reject);
  });
};
