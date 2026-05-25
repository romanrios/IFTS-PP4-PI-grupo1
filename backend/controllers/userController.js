import User from "../models/User.js";

// @desc    Actualizar datos de perfil del adoptante (Usuario logueado)
// @route   PUT /api/users/perfil
// @access  Privado
export const updatePerfilAdoptante = async (req, res) => {
    try {
        const { telefono, localidad, descripcionHogar } = req.body;
        const userId = req.user._id; // Extraído automáticamente gracias al authMiddleware

        const userActualizado = await User.findByIdAndUpdate(
            userId,
            { telefono, localidad, descripcionHogar },
            { returnDocument: 'after' } // Evita el warning de Mongoose
        );

        if (!userActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(userActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
    }
};

// @desc    Obtener todos los usuarios (Para panel de admin)
// @route   GET /api/users
// @access  Público/Privado (según decidan después)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};