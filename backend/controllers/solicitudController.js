import Gato from "../models/Gato.js";
import Solicitud from "../models/Solicitud.js";

// @desc    Crear una nueva solicitud de adopción (Cuando el usuario aprieta "Adoptar")
// @route   POST /api/solicitudes
export const createSolicitud = async (req, res) => {
  const { usuario, gato, motivo, telefonoContacto } = req.body;

  try {
    // 1. Verificar si el gato existe en la base de datos
    const gatoDB = await Gato.findById(gato);

    if (!gatoDB) {
      return res.status(404).json({
        message: "Michi no encontrado",
      });
    }

    // 2. Verificar si el gato ya está adoptado
    if (gatoDB.estadoAdopcion === "Adoptado") {
      return res.status(400).json({
        message: "Este michi ya fue adoptado",
      });
    }

    // 3. Validar si el usuario ya envió una solicitud previa para este mismo gato
    const solicitudExistente = await Solicitud.findOne({
      usuario,
      gato,
    });

    if (solicitudExistente) {
      return res.status(400).json({
        message: "Ya enviaste una solicitud para este michi",
      });
    }

    // 4. Si pasa todos los filtros, se crea y guarda la solicitud
    const nuevaSolicitud = new Solicitud({
      usuario,
      gato,
      motivo,
      telefonoContacto,
    });

    const solicitudGuardada = await nuevaSolicitud.save();
    res.status(201).json(solicitudGuardada);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al enviar la solicitud", error: error.message });
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
    res.status(500).json({
      message: "Error al obtener las solicitudes",
      error: error.message,
    });
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
      { returnDocument: "after", runValidators: true },
    );

    if (!solicitudActualizada) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (estadoSolicitud === "Aprobada") {
      await Gato.findByIdAndUpdate(solicitudActualizada.gato, {
        estadoAdopcion: "Adoptado",
      });

      await Solicitud.updateMany(
        {
          gato: solicitudActualizada.gato,
          _id: {
            $ne: solicitudActualizada._id,
          },
        },
        {
          estadoSolicitud: "Rechazada",
        },
      );
    }

    res.status(200).json(solicitudActualizada);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar el estado", error: error.message });
  }
};

// @desc    Eliminar una solicitud
// @route   DELETE /api/solicitudes/:id
export const deleteSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    res.status(200).json({
      message: "Solicitud eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la solicitud",
      error: error.message,
    });
  }
};
