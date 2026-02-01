import prisma from "../config/prisma.js";
import { generateInterviewQuestions } from "../services/geminiService.js";
import { evaluateInterview } from "../services/evaluationService.js";

/**
 * =========================
 * START INTERVIEW
 * =========================
 * (UNCHANGED – kept exactly as-is)
 */
export const startInterview = async (req, res) => {
  try {
    const {
      targetRole,
      experienceLevel,
      topics = [],
      description = "",
    } = req.body;

    const user = req.dbUser;

    if (!targetRole || !experienceLevel) {
      return res.status(400).json({
        error: "Target role and experience level are required",
      });
    }

    const questionsTextArray = await generateInterviewQuestions({
      targetRole,
      experienceLevel,
      topics,
      count: 10,
    });

    const session = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        targetRole,
        experienceLevel,
        topics,
        description,
        questionCount: questionsTextArray.length,
        status: "ONGOING",
      },
    });

    const storedQuestions = [];

    for (let i = 0; i < questionsTextArray.length; i++) {
      const question = await prisma.question.create({
        data: {
          targetRole,
          experienceLevel,
          content: questionsTextArray[i],
        },
      });

      await prisma.sessionQuestion.create({
        data: {
          sessionId: session.id,
          questionId: question.id,
          order: i + 1,
        },
      });

      storedQuestions.push(question);
    }

    return res.status(201).json({
      sessionId: session.id,
      currentQuestion: {
        id: storedQuestions[0].id,
        content: storedQuestions[0].content,
        order: 1,
      },
      totalQuestions: storedQuestions.length,
    });
  } catch (error) {
    console.error("Start interview error:", error);
    return res.status(500).json({
      error: "Failed to start interview session",
    });
  }
};

/**
 * =========================
 * FINISH INTERVIEW (FIXED)
 * =========================
 */
export const finishInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const user = req.dbUser;

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId is required",
      });
    }

    // 1️⃣ Verify session ownership
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        error: "Interview session not found",
      });
    }

    // 2️⃣ Fetch questions (ordered)
    const sessionQuestions = await prisma.sessionQuestion.findMany({
      where: { sessionId },
      orderBy: { order: "asc" },
      include: {
        question: true,
      },
    });

    // 3️⃣ Fetch responses
    const responses = await prisma.response.findMany({
      where: { sessionId },
    });

    // 4️⃣ Build QA pairs
    const qaPairs = sessionQuestions.map((sq) => {
      const response = responses.find(
        (r) => r.questionId === sq.questionId
      );

      return {
        question: sq.question.content,
        answer:
          response?.textAnswer ??
          (response?.videoUrl
            ? "[Video answer provided by candidate]"
            : "[No answer provided]"),
      };
    });

    // 5️⃣ Evaluate FULL interview (single Gemini call)
    const evaluationResult = await evaluateInterview({
      targetRole: session.targetRole,
      experienceLevel: session.experienceLevel,
      qaPairs,
    });

    // 6️⃣ Store session-level evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        sessionId: session.id,
        correctness: evaluationResult.correctness,
        completeness: evaluationResult.completeness,
        clarity: evaluationResult.clarity,
        communication: evaluationResult.communication,
        overallScore: evaluationResult.overallScore,
        feedback: evaluationResult.summary,
        improvement: evaluationResult.improvements,
      },
    });

    // 7️⃣ Mark interview completed
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });

    return res.status(200).json({
      sessionId,
      evaluation,
    });
  } catch (error) {
    console.error("Finish interview error:", error);
    return res.status(500).json({
      error: "Failed to finish interview",
    });
  }
};


/**
 * =========================
 * GET INTERVIEW REVIEW (FIXED)
 * =========================
 */
export const getInterviewReview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = req.dbUser;

    // 1️⃣ Verify session ownership
    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        error: "Interview session not found",
      });
    }

    // 2️⃣ Fetch evaluation BY SESSION
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        sessionId,
      },
    });

    if (!evaluation) {
      return res.status(404).json({
        error: "Interview evaluation not found",
      });
    }

    return res.status(200).json({
      session,
      evaluation,
    });
  } catch (error) {
    console.error("Get interview review error:", error);
    return res.status(500).json({
      error: "Failed to load interview review",
    });
  }
};
