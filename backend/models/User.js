import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // --- CAMPOS NUEVOS PARA EL ADOPTANTE ---
    telefono: { type: String, default: "" },
    direccion: { type: String, default: "" },
    localidad: { type: String, default: "" },
    descripcion: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
