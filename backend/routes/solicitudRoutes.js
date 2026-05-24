import express from "express";
import {
  createSolicitud,
  getSolicitudes,
  updateEstadoSolicitud
} from "../controllers/solicitudController.js";

const router = express.Router();

router.post("/", createSolicitud);          // Enviar formulario
router.get("/", getSolicitudes);            // Ver todas las solicitudes (Admin)
router.put("/:id", updateEstadoSolicitud);  // Cambiar estado a Aprobada/Rechazada

export default router;