import express from "express";
import {
  createSolicitud,
  deleteSolicitud,
  deleteMiSolicitud,
  getMisSolicitudes,
  getMiSolicitudByGato,
  getSolicitudes,
  getSolicitudesByGato,
  updateEstadoSolicitud,
  updateMiSolicitud,
} from "../controllers/solicitudController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSolicitud);                            // Enviar formulario
router.get("/mis", authMiddleware, getMisSolicitudes);                        // Solicitudes del usuario
router.get("/michi/:gatoId", authMiddleware, getMiSolicitudByGato);           // Solicitud del usuario para un michi
router.get("/gato/:gatoId", authMiddleware, adminMiddleware, getSolicitudesByGato); // Solicitudes de un michi (Admin)
router.get("/", authMiddleware, adminMiddleware, getSolicitudes);             // Ver todas las solicitudes (Admin)
router.put("/:id/mi", authMiddleware, updateMiSolicitud);                     // Editar solicitud pendiente propia
router.delete("/:id/mi", authMiddleware, deleteMiSolicitud);                  // Cancelar solicitud pendiente propia
router.put("/:id", authMiddleware, adminMiddleware, updateEstadoSolicitud);   // Cambiar estado a Aprobada/Rechazada
router.delete("/:id", authMiddleware, adminMiddleware, deleteSolicitud);

export default router;