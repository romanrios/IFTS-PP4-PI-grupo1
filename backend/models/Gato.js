import mongoose from "mongoose";

const gatoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del michi es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede superar los 30 caracteres"],
    },
    edadAprox: {
      type: String,
      required: [true, "La edad aproximada es obligatoria"],
      minlength: [1, "La edad aproximada es obligatoria"],
      maxlength: [20, "La edad no puede superar los 20 caracteres"],
    },
    sexo: {
      type: String,
      required: [true, "El sexo (M/H) es obligatorio"],
      enum: ["M", "H"] 
    },
    descripcion: {
      type: String,
      required: [true, "Por favor, contanos por qué es tan adorable"],
      trim: true,
      minlength: [20, "La descripción debe tener al menos 20 caracteres"],
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
    },
    foto: {
      type: String,
      default: "/michis/michi_01.jpg",
      maxlength: [500, "La URL de la foto no puede superar los 500 caracteres"],
    },
    estadoAdopcion: {
      type: String,
      enum: ["No publicado", "Publicado", "Con solicitudes", "Adoptado"],
      default: "Publicado"
    }
  },
  {
    timestamps: true // Se crean automáticamente las columnas "fecha de creación" y "actualización"
  }
);

export default mongoose.model("Gato", gatoSchema);