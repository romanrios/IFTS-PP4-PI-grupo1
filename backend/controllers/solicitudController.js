import Solicitud from "../models/Solicitud.js";

// @desc    Crear una nueva solicitud de adopción (Cuando el usuario aprieta "Adoptar")
// @route   POST /api/solicitudes
export const createSolicitud = async (req, res) => {
  const { usuario, gato, motivo, telefonoContacto } = req.body;

  try {
    const nuevaSolicitud = new Solicitud({
      usuario,
      gato,
      motivo,
      telefonoContacto
    });

    const solicitudGuardada = await nuevaSolicitud.save();
    res.status(201).json(solicitudGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al enviar la solicitud", error: error.message });
  }
};

// @desc    Obtener todas las solicitudes (Para el panel del Administrador)
// @route   GET /api/solicitudes
export const getSolicitudes = async (req, res) => {
  try {
    // El .populate trae los datos reales vinculados de las colecciones de usuarios y gatos
    const solicitudes = await Solicitud.find()
      .populate("usuario", "name email") // Trae solo nombre y mail del adoptante
      .populate("gato", "nombre foto estadoAdopcion"); // Trae datos clave del michi

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las solicitudes", error: error.message });
  }
};

// @desc    Actualizar el estado de una solicitud (Aprobar o Rechazar)
// @route   PUT /api/solicitudes/:id
export const updateEstadoSolicitud = async (req, res) => {
  const { estadoSolicitud } = req.body; 

  try {
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estadoSolicitud },
      { returnDocument: 'after', runValidators: true }
    );

    if (!solicitudActualizada) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.status(200).json(solicitunActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el estado", error: error.message });
  }
};