import express from "express";
import { 
  getGatos, 
  getGatoById, 
  createGato, 
  updateGato, 
  deleteGato 
} from "../controllers/gatoController.js";

const router = express.Router();

// Por ahora, dejamos todas las rutas libres para que se pueda conectar sin problemas desde el Front
router.get("/", getGatos);
router.get("/:id", getGatoById);
router.post("/", createGato);
router.put("/:id", updateGato);
router.delete("/:id", deleteGato);

export default router;