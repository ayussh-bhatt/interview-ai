import { exec } from "child_process";
import path from "path";

export const transcribeAudio = (audioPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("ml/transcribe.py");

    exec(`python ${scriptPath} ${audioPath}`, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};
