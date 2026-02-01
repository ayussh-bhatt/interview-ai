import prisma from "../config/prisma.js";

export const getUserAnalytics = async (userId) => {
  // 1️⃣ Get all evaluations for the user's sessions
  const evaluations = await prisma.evaluation.findMany({
    where: {
      session: {
        userId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // 2️⃣ No interviews yet
  if (evaluations.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      pastInterviews: [],
    };
  }

  // 3️⃣ Aggregate scores
  const totalScore = evaluations.reduce(
    (sum, e) => sum + e.overallScore,
    0
  );

  const averageScore = Math.round(
    totalScore / evaluations.length
  );

  // 4️⃣ Fetch past interviews metadata
  const pastInterviews = await prisma.interviewSession.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      targetRole: true,
      experienceLevel: true,
      topics: true,
      description: true,
      questionCount: true,
      createdAt: true,
    },
  });

  return {
    totalInterviews: evaluations.length,
    averageScore,
    pastInterviews,
  };
};
