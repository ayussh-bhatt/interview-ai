import prisma from "../config/prisma.js";

/**
 * =========================
 * VIDEO RESPONSE
 * =========================
 */
export const submitVideoResponse = async (req, res) => {
  try {
    const { sessionId, questionId, videoUrl } = req.body;

    if (!sessionId || !questionId || !videoUrl) {
      return res.status(400).json({
        error: "sessionId, questionId and videoUrl are required",
      });
    }

    await prisma.response.create({
      data: {
        videoUrl,
        session: {
          connect: { id: sessionId },
        },
        question: {
          connect: { id: questionId },
        },
      },
    });

    const nextQuestion = await getNextQuestion(sessionId, questionId);

    return res.status(201).json({
      nextQuestion,
      isInterviewComplete: !nextQuestion,
    });
  } catch (err) {
    console.error("Submit video response error:", err);
    return res.status(500).json({ error: "Failed to submit response" });
  }
};


/**
 * =========================
 * TEXT RESPONSE
 * =========================
 */
export const submitTextResponse = async (req, res) => {
  try {
    const { sessionId, questionId, textAnswer } = req.body;

    if (!sessionId || !questionId || !textAnswer) {
      return res.status(400).json({
        error: "sessionId, questionId and textAnswer are required",
      });
    }

    await prisma.response.create({
      data: {
        textAnswer,
        session: {
          connect: { id: sessionId },
        },
        question: {
          connect: { id: questionId },
        },
      },
    });

    const nextQuestion = await getNextQuestion(sessionId, questionId);

    return res.status(201).json({
      nextQuestion,
      isInterviewComplete: !nextQuestion,
    });
  } catch (err) {
    console.error("Submit text response error:", err);
    return res.status(500).json({ error: "Failed to submit response" });
  }
};


/**
 * =========================
 * HELPERS
 * =========================
 */
const getNextQuestion = async (sessionId, currentQuestionId) => {
  // Find current question order
  const currentLink = await prisma.sessionQuestion.findFirst({
    where: {
      sessionId,
      questionId: currentQuestionId,
    },
  });

  if (!currentLink) return null;

  // Find next question by order
  const nextLink = await prisma.sessionQuestion.findFirst({
    where: {
      sessionId,
      order: currentLink.order + 1,
    },
    include: {
      question: true,
    },
  });

  if (!nextLink) return null;

  return {
    id: nextLink.question.id,
    content: nextLink.question.content,
    order: nextLink.order,
  };
};
