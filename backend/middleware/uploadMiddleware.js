import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"), false);
    }
  },
});

export const uploadGatoFoto = (req, res, next) => {
  upload.single("foto")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "Error al subir el archivo",
        error: err.message,
      });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
