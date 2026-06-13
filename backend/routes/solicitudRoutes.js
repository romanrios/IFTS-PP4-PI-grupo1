import express from "express";
import {
  createSolicitud,
  deleteSolicitud,
  getSolicitudes,
  updateEstadoSolicitud,
} from "../controllers/solicitudController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSolicitud);                            // Enviar formulario
router.get("/", authMiddleware, adminMiddleware, getSolicitudes);             // Ver todas las solicitudes (Admin)
router.put("/:id", authMiddleware, adminMiddleware, updateEstadoSolicitud);   // Cambiar estado a Aprobada/Rechazada
router.delete("/:id", authMiddleware, adminMiddleware, deleteSolicitud);

export default router;