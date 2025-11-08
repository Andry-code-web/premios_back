const db = require("../db/connection");

// Obtener tickets de un cliente
exports.getTicketsByCliente = async (req, res) => {
  const { dni } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT t.*, s.nombre AS sorteo
       FROM tickets t
       JOIN clientes c ON t.cliente_id = c.id
       JOIN sorteos s ON t.sorteo_id = s.id
       WHERE c.dni = ?`,
      [dni]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tickets", error });
  }
};