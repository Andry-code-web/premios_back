const express = require("express");
const multer = require("multer");
const router = express.Router();
const { getAllPremios, createPremio } = require("../controllers/premios.controller");

// Configuración de Multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB
});

// Rutas
router.get("/", getAllPremios);
router.post("/", upload.single("imagen_1"), createPremio);

module.exports = router;