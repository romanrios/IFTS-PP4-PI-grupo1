import express from "express";
import {
  createSolicitud,
  deleteMiSolicitud,
  deleteSolicitud,
  getMiSolicitudByGato,
  getMisSolicitudes,
  getSolicitudes,
  getSolicitudesByGato,
  updateEstadoSolicitud,
  updateMiSolicitud,
} from "../controllers/solicitudController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSolicitud);
router.get("/mis", authMiddleware, getMisSolicitudes);
router.get("/michi/:gatoId", authMiddleware, getMiSolicitudByGato);
router.get("/gato/:gatoId", authMiddleware, adminMiddleware, getSolicitudesByGato);
router.get("/", authMiddleware, adminMiddleware, getSolicitudes);
router.put("/:id/mi", authMiddleware, updateMiSolicitud);
router.delete("/:id/mi", authMiddleware, deleteMiSolicitud);
router.put("/:id", authMiddleware, adminMiddleware, updateEstadoSolicitud);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSolicitud);

export default router;