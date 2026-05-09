import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// obtener perfil
router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

export default router;
