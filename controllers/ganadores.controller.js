const db = require("../db/connection");

exports.getGanadores = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        g.id AS ganador_id,
        g.premio,
        g.fecha_ganador,
        c.nombres,
        c.apellidos,
        c.dni,
        c.email,
        c.celular
      FROM ganadores g
      INNER JOIN clientes c ON g.cliente_id = c.id
      ORDER BY g.fecha_ganador DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener a los ganadores", error });
  }
};
