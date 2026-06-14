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
import { uploadGatoFoto } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGatos);
router.get("/:id", authMiddleware, getGatoById);
router.post("/", authMiddleware, adminMiddleware, uploadGatoFoto, createGato);
router.put("/:id", authMiddleware, adminMiddleware, uploadGatoFoto, updateGato);
router.delete("/:id", authMiddleware, adminMiddleware, deleteGato);

export default router;