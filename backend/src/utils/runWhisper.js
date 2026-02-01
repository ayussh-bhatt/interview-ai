import { execFile } from "child_process";

export const runWhisper = (audioPath) => {
  return new Promise((resolve, reject) => {
    execFile(
      "python",
      ["whisper/transcribe.py", audioPath],
      (error, stdout) => {
        if (error) {
          return reject(error);
        }

        try {
          const result = JSON.parse(stdout);
          resolve(result.text);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
