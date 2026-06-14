import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La solicitud debe pertenecer a un usuario"]
    },
    gato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gato",
      required: [true, "Debe especificar qué michi desea adoptar"]
    },
    motivo: {
      type: String,
      required: [true, "Por favor, contanos por qué querés adoptar a este michi"],
      trim: true,
      minlength: [30, "El motivo debe tener al menos 30 caracteres"],
      maxlength: [400, "El motivo no puede superar los 400 caracteres"],
    },
    telefonoContacto: {
      type: String,
      required: [true, "Necesitamos un teléfono de contacto"],
      minlength: [6, "El teléfono debe tener al menos 6 caracteres"],
      maxlength: [20, "El teléfono no puede superar los 20 caracteres"],
    },
    estadoSolicitud: {
      type: String,
      enum: ["Pendiente", "Aprobada", "Rechazada"],
      default: "Pendiente" // Toda solicitud nace en estado Pendiente de revisión
    }
  },
  {
    timestamps: true // Aporta la fecha exacta de cuándo se envió la solicitud
  }
);

export default mongoose.model("Solicitud", solicitudSchema);