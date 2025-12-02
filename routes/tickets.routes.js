const express = require("express");
const router = express.Router();
const {
  getTicketsByCliente,
  getAllTickets,
  createTicket
} = require("../controllers/tickets.controller");

router.get("/", getAllTickets);
router.get("/:dni", getTicketsByCliente);
router.post("/", createTicket);

module.exports = router;