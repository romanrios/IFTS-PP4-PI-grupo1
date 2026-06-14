import mongoose from "mongoose";
import Gato from "../models/Gato.js";
import { uploadImage } from "../config/cloudinary.js";

const getVisibilityFilter = (user) =>
  user?.isAdmin ? {} : { estadoAdopcion: { $ne: "No publicado" } };

// @desc    Obtener todos los gatos (Para que los adoptantes vean la lista)
// @route   GET /api/gatos
export const getGatos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;
    const visibilityFilter = getVisibilityFilter(req.user);

    const [gatos, totalItems] = await Promise.all([
      Gato.aggregate([
        { $match: visibilityFilter },
        {
          $addFields: {
            _adoptedLast: {
              $cond: [{ $eq: ["$estadoAdopcion", "Adoptado"] }, 1, 0],
            },
          },
        },
        { $sort: { _adoptedLast: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { _adoptedLast: 0 } },
      ]),
      Gato.countDocuments(visibilityFilter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.status(200).json({
      data: gatos,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los michis", error: error.message });
  }
};

// @desc    Obtener un solo gato por su ID (Para ver el detalle de un michi)
// @route   GET /api/gatos/:id
export const getGatoById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const gato = await Gato.findById(req.params.id);
    if (!gato) {
      return res.status(404).json({ message: "Michi no encontrado" });
    }

    if (!req.user.isAdmin && gato.estadoAdopcion === "No publicado") {
      return res.status(404).json({ message: "Michi no encontrado" });
    }

    res.status(200).json(gato);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el detalle del michi", error: error.message });
  }
};

// @desc    Crear un nuevo gato (Solo para el Administrador)
// @route   POST /api/gatos
export const createGato = async (req, res) => {
  const { nombre, edadAprox, sexo, descripcion, foto, estadoAdopcion } = req.body;

  try {
    let fotoUrl = foto;

    if (req.file) {
      fotoUrl = await uploadImage(req.file.buffer);
    }

    const nuevoGato = new Gato({
      nombre,
      edadAprox,
      sexo,
      descripcion,
      ...(fotoUrl && { foto: fotoUrl }),
      estadoAdopcion,
    });

    const gatoGuardado = await nuevoGato.save();
    res.status(201).json(gatoGuardado);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar el michi", error: error.message });
  }
};

// @desc    Actualizar los datos de un gato o su estado (Para editar o marcar como Adoptado)
// @route   PUT /api/gatos/:id
export const updateGato = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const gatoExistente = await Gato.findById(req.params.id);

    if (!gatoExistente) {
      return res.status(404).json({ message: "Michi no encontrado para actualizar" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.foto = await uploadImage(req.file.buffer);
    } else if (updateData.foto === undefined || updateData.foto === "") {
      delete updateData.foto;
    }

    const gatoActualizado = await Gato.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json(gatoActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el michi", error: error.message });
  }
};

// @desc    Eliminar el registro de un gato (Solo por si el Admin se equivocó)
// @route   DELETE /api/gatos/:id
export const deleteGato = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID inválido",
    });
  }

  try {
    const gatoEliminado = await Gato.findByIdAndDelete(req.params.id);
    
    if (!gatoEliminado) {
      return res.status(404).json({ message: "Michi no encontrado para eliminar" });
    }

    res.status(200).json({ message: "Michi eliminado correctamente del sistema" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el michi", error: error.message });
  }
};