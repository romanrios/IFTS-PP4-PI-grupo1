import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ruta de prueba
app.get("/api", (req, res) => {
  res.send("API funcionando 🚀");
});


// conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});