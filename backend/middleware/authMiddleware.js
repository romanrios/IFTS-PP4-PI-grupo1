const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // formato: "Bearer TOKEN"
    const tokenClean = token.split(" ")[1];

    const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = authMiddleware;