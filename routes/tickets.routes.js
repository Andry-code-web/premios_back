const express = require("express");
const router = express.Router();
const {
  getTicketsByCliente
} = require("../controllers/tickets.controller");


router.get("/:dni", getTicketsByCliente);


module.exports = router;