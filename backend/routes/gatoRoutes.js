import express from "express";
import { 
  getGatos, 
  getGatoById, 
  createGato, 
  updateGato, 
  deleteGato 
} from "../controllers/gatoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGatos);
router.get("/:id", authMiddleware, getGatoById);
router.post("/", authMiddleware, adminMiddleware, createGato);
router.put("/:id", authMiddleware, adminMiddleware, updateGato);
router.delete("/:id", authMiddleware, adminMiddleware, deleteGato);

export default router;