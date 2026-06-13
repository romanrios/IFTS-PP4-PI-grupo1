import express from "express";
import {
  createSolicitud,
  deleteSolicitud,
  getSolicitudes,
  updateEstadoSolicitud,
} from "../controllers/solicitudController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSolicitud);          // Enviar formulario
router.get("/", authMiddleware, getSolicitudes);            // Ver todas las solicitudes (Admin)
router.put("/:id", authMiddleware, updateEstadoSolicitud);  // Cambiar estado a Aprobada/Rechazada
router.delete("/:id", authMiddleware, deleteSolicitud);

export default router;