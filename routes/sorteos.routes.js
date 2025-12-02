const express = require("express");
const router = express.Router();
const {
    getSorteos,
    getSorteoById,
    createSorteo,
    updateSorteoEstado,
} = require("../controllers/sorteos.controller");

router.get("/", getSorteos);
router.get("/:id", getSorteoById);
router.post("/", createSorteo);
router.patch("/:id/estado", updateSorteoEstado);

module.exports = router;