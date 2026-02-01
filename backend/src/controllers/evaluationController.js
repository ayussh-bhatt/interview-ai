import prisma from "../config/prisma.js";
import path from "path";
import fs from "fs";
import { downloadVideo } from "../utils/downloadVideo.js";
import { extractAudio } from "../utils/extractAudio.js";
import { runWhisper } from "../utils/runWhisper.js";
import { evaluateAnswer } from "../services/evaluationService.js";

const TEMP_DIR = "temp";

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

export const evaluateResponse = async (req, res) => {
  let videoPath;
  let audioPath;

  try {
    const { responseId } = req.body;

    if (!responseId) {
      return res.status(400).json({ error: "responseId is required" });
    }

    // 1️⃣ Fetch response + question + session
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        question: true,
        session: true,
      },
    });

    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }

    const videoUrl = response.videoUrl;

    // 2️⃣ Temp file paths
    videoPath = path.join(TEMP_DIR, `response-${responseId}.mp4`);
    audioPath = path.join(TEMP_DIR, `audio-${responseId}.wav`);

    // 3️⃣ Download video
    await downloadVideo(videoUrl, videoPath);

    // 4️⃣ Extract audio
    await extractAudio(videoPath, audioPath);

    // 5️⃣ Whisper transcription with TIMEOUT protection
    const transcript = await Promise.race([
      runWhisper(audioPath),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Whisper transcription timed out")),
          60_000 // 60 seconds
        )
      ),
    ]);

    // 6️⃣ Gemini evaluation
    const result = await evaluateAnswer({
      question: response.question.content,
      transcript,
      role: response.session.role,
      experienceLevel: response.session.experienceLevel,
    });

    const overallScore = Math.round(
      (result.correctness +
        result.completeness +
        result.clarity +
        result.communication) / 4
    );

    // 7️⃣ Store evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        responseId,
        correctness: result.correctness,
        completeness: result.completeness,
        clarity: result.clarity,
        communication: result.communication,
        overallScore,
        feedback: result.feedback,
        improvement: result.improvement,
      },
    });

    return res.status(201).json({
      transcript,
      evaluation,
    });
  } catch (error) {
    console.error("Evaluation pipeline error:", error);
    return res.status(500).json({
      error: "Evaluation failed",
    });
  } finally {
    // 8️⃣ SAFE CLEANUP (runs even if error occurs)
    try {
      if (videoPath && fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      if (audioPath && fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    } catch (cleanupError) {
      console.error("Temp file cleanup error:", cleanupError);
    }
  }
};
