import prisma from "../config/prisma.js";

export const syncUser = async (req, res, next) => {
  try {
    // 🔑 From Firebase decoded token
    const firebaseUid = req.user.uid;
    const email = req.user.email;

    if (!firebaseUid) {
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
        },
      });
    }

    // Attach DB user to request
    req.dbUser = user;
    next();
  } catch (error) {
    console.error("syncUser error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
