import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ status: false, message: "Not Authorized!" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode?.id) {
      req.user = { userId: tokenDecode.id };
      next();
    } else {
      return res.status(401).json({ status: false, message: "Invalid token!" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Internal Error" }, error);
  }
};

export default userAuth;
