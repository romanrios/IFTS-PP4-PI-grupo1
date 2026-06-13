import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUsers, updatePerfilAdoptante } from "../controllers/userController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});
router.put("/perfil", authMiddleware, updatePerfilAdoptante);
router.get("/", authMiddleware, adminMiddleware, getUsers);

export default router;
