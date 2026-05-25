import mongoose from "mongoose";

const gatoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del michi es obligatorio"],
      trim: true
    },
    edadAprox: {
      type: String,
      required: [true, "La edad aproximada es obligatoria"]
    },
    sexo: {
      type: String,
      required: [true, "El sexo (M/H) es obligatorio"],
      enum: ["M", "H"] 
    },
    descripcion: {
      type: String,
      required: [true, "Por favor, contanos por qué es tan adorable"],
      trim: true
    },
    foto: {
      type: String,
      default: "https://via.placeholder.com/150" // Foto por defecto por si no se carga una al principio
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