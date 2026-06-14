import mongoose from "mongoose";
import Gato from "../models/Gato.js";
import Solicitud from "../models/Solicitud.js";

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const actualizarEstadoGato = async (gatoId) => {
  if (!mongoose.Types.ObjectId.isValid(gatoId)) {
    return;
  }

  const gatoDB = await Gato.findById(gatoId);
  if (!gatoDB || gatoDB.estadoAdopcion === "Adoptado") {
    return;
  }

  const solicitudesPendientes = await Solicitud.countDocuments({
    gato: gatoId,
    estadoSolicitud: "Pendiente",
  });

  await Gato.findByIdAndUpdate(gatoId, {
    estadoAdopcion: solicitudesPendientes > 0 ? "Con solicitudes" : "Publicado",
  });
};

// @desc    Crear una nueva solicitud de adopción (Cuando el usuario aprieta "Adoptar")
// @route   POST /api/solicitudes
export const createSolicitud = async (req, res) => {
  const { gato, motivo, telefonoContacto } = req.body;

  const usuario = req.user._id;

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

    if (solicitudExistente && solicitudExistente.estadoSolicitud !== "Rechazada") {
      return res.status(400).json({
        message: "Ya enviaste una solicitud para este michi",
      });
    }

    // 4. Si el usuario tenía una solicitud rechazada, podemos crear una nueva solicitud
    const nuevaSolicitud = new Solicitud({
      usuario,
      gato,
      motivo,
      telefonoContacto,
    });

    const solicitudGuardada = await nuevaSolicitud.save();
    // 5. Si el michi está en estado "Publicado", actualizarlo a "Con solicitudes".
    //    Usamos una actualización condicional para que la operación sea segura
    //    frente a condiciones de carrera: solo cambiaremos el estado si
    //    actualmente es exactamente "Publicado". De esta forma la primera
    //    solicitud que llegue provocará la transición y las siguientes no
    //    revertirán ni duplicarán la operación.
    await Gato.findOneAndUpdate(
      { _id: gato, estadoAdopcion: "Publicado" },
      { estadoAdopcion: "Con solicitudes" },
    );

    res.status(201).json(solicitudGuardada);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al enviar la solicitud", error: error.message });
  }
};

// @desc    Obtener las solicitudes del usuario autenticado
// @route   GET /api/solicitudes/mis
export const getMisSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({ usuario: req.user._id })
      .populate("gato", "nombre foto estadoAdopcion")
      .sort({ createdAt: -1 });

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tus solicitudes",
      error: error.message,
    });
  }
};

// @desc    Obtener la solicitud del usuario autenticado para un michi
// @route   GET /api/solicitudes/michi/:gatoId
export const getMiSolicitudByGato = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.gatoId)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const solicitud = await Solicitud.findOne({
      usuario: req.user._id,
      gato: req.params.gatoId,
    });

    if (!solicitud) {
      return res.status(200).json({
        existe: false,
        solicitud: null,
      });
    }

    res.status(200).json({
      existe: true,
      solicitud,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la solicitud",
      error: error.message,
    });
  }
};

// @desc    Actualizar una solicitud pendiente del usuario autenticado
// @route   PUT /api/solicitudes/:id/mi
export const updateMiSolicitud = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  const { motivo, telefonoContacto } = req.body;

  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      usuario: req.user._id,
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.estadoSolicitud !== "Pendiente") {
      return res.status(400).json({
        message: "Solo podés editar solicitudes pendientes",
      });
    }

    solicitud.motivo = motivo;
    solicitud.telefonoContacto = telefonoContacto;

    const solicitudActualizada = await solicitud.save();

    res.status(200).json(solicitudActualizada);
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar la solicitud",
      error: error.message,
    });
  }
};

// @desc    Eliminar una solicitud pendiente del usuario autenticado
// @route   DELETE /api/solicitudes/:id/mi
export const deleteMiSolicitud = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const solicitud = await Solicitud.findOne({
      _id: req.params.id,
      usuario: req.user._id,
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.estadoSolicitud !== "Pendiente") {
      return res.status(400).json({
        message: "Solo podés cancelar solicitudes pendientes",
      });
    }

    const gatoId = solicitud.gato;
    await solicitud.deleteOne();
    await actualizarEstadoGato(gatoId);

    res.status(200).json({
      message: "Solicitud cancelada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar la solicitud",
      error: error.message,
    });
  }
};

// @desc    Obtener solicitudes asociadas a un michi (Para el detalle del administrador)
// @route   GET /api/solicitudes/gato/:gatoId
export const getSolicitudesByGato = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.gatoId)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const solicitudes = await Solicitud.find({ gato: req.params.gatoId })
      .populate("usuario", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las solicitudes del michi",
      error: error.message,
    });
  }
};

// @desc    Obtener todas las solicitudes (Para el panel del Administrador)
// @route   GET /api/solicitudes
export const getSolicitudes = async (req, res) => {
  try {
    // Parámetros de filtrado
    const estadoSolicitud = req.query.estadoSolicitud ? req.query.estadoSolicitud.trim() : "";
    const search = req.query.search ? req.query.search.trim() : "";
    const sortOrder = parseInt(req.query.sort, 10) || -1; // -1 = más recientes, 1 = más antiguos

    // Construir filtro base
    let matchFilter = {};
    if (estadoSolicitud) {
      matchFilter.estadoSolicitud = estadoSolicitud;
    }

    // Obtener solicitudes con filtros
    let query = Solicitud.find(matchFilter)
      .populate("usuario", "name email")
      .populate("gato", "nombre foto estadoAdopcion")
      .sort({ createdAt: sortOrder });

    let solicitudes = await query;

    // Filtrar por búsqueda de texto si se proporciona
    if (search) {
      const normalizedSearch = normalizeText(search);
      solicitudes = solicitudes.filter((s) => {
        const gatoNombre = normalizeText(s.gato?.nombre || "");
        const usuarioNombre = normalizeText(s.usuario?.name || "");
        return gatoNombre.includes(normalizedSearch) || usuarioNombre.includes(normalizedSearch);
      });
    }

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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  const { estadoSolicitud } = req.body;

  const session = await Gato.startSession();

  try {
    session.startTransaction();

    // 1. Actualizar la solicitud
    const solicitudActualizada = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estadoSolicitud },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!solicitudActualizada) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    // 2. Si se aprueba, marcar el gato como adoptado
    //    y rechazar automáticamente las demás solicitudes
    if (estadoSolicitud === "Aprobada") {
      await Gato.findByIdAndUpdate(
        solicitudActualizada.gato,
        {
          estadoAdopcion: "Adoptado",
        },
        { session },
      );

      await Solicitud.updateMany(
        {
          gato: solicitudActualizada.gato,
          _id: { $ne: solicitudActualizada._id },
        },
        {
          estadoSolicitud: "Rechazada",
        },
        { session },
      );
    }

    // 3. Confirmar todos los cambios
    await session.commitTransaction();

    if (estadoSolicitud === "Rechazada") {
      await actualizarEstadoGato(solicitudActualizada.gato);
    }

    return res.status(200).json(solicitudActualizada);
  } catch (error) {
    await session.abortTransaction();

    return res.status(400).json({
      message: "Error al actualizar el estado",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// @desc    Eliminar una solicitud
// @route   DELETE /api/solicitudes/:id
export const deleteSolicitud = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    await actualizarEstadoGato(solicitud.gato);

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
