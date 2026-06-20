import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      maxlength: [80, "El nombre no puede superar los 80 caracteres"],
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
    telefono: {
      type: String,
      default: "",
      maxlength: [20, "El teléfono no puede superar los 20 caracteres"],
    },
    direccion: {
      type: String,
      default: "",
      maxlength: [100, "La dirección no puede superar los 100 caracteres"],
    },
    localidad: {
      type: String,
      default: "",
      maxlength: [50, "La localidad no puede superar los 50 caracteres"],
    },
    descripcion: {
      type: String,
      default: "",
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
      validate: {
        validator(value) {
          if (!value || value.trim().length === 0) return true;
          return value.trim().length >= 10;
        },
        message: "La descripción debe tener al menos 10 caracteres",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
