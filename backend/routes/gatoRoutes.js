import express from "express";
import { 
  getGatos, 
  getGatoById, 
  createGato, 
  updateGato, 
  deleteGato 
} from "../controllers/gatoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGatos);
router.get("/:id", authMiddleware, getGatoById);
router.post("/", authMiddleware, createGato);
router.put("/:id", authMiddleware, updateGato);
router.delete("/:id", authMiddleware, deleteGato);

export default router;