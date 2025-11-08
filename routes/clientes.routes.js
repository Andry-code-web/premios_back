const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getClientes,
  getClienteByDni,
  createCliente,
} = require("../controllers/clientes.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB


router.get("/", getClientes);
router.get("/:dni", getClienteByDni);
router.post("/", upload.single("voucher"), createCliente);

module.exports = router;
