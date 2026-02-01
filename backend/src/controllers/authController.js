export const verifyUser = async (req, res) => {
  const user = req.dbUser;

  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
};
