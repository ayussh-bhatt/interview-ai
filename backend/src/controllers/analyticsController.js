import { getUserAnalytics } from "../services/analyticsService.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const user = req.dbUser;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const analytics = await getUserAnalytics(user.id);

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      error: "Failed to load analytics",
    });
  }
};
