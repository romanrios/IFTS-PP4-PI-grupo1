import express from "express";
import {
  createSolicitud,
  deleteSolicitud,
  getSolicitudes,
  updateEstadoSolicitud,
} from "../controllers/solicitudController.js";


const router = express.Router();

router.post("/", createSolicitud);          // Enviar formulario
router.get("/", getSolicitudes);            // Ver todas las solicitudes (Admin)
router.put("/:id", updateEstadoSolicitud);  // Cambiar estado a Aprobada/Rechazada
router.delete("/:id", deleteSolicitud);

export default router;