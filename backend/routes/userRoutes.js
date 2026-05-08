const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// obtener perfil
router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;