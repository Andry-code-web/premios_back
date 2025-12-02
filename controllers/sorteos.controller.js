const db = require("../db/connection");

// Obtener todos los sorteos
exports.getSorteos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sorteos ORDER BY fecha_inicio DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener sorteos", error });
  }
};

// Obtener sorteo por ID
exports.getSorteoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM sorteos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Sorteo no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar sorteo", error });
  }
};

// Crear nuevo sorteo
exports.createSorteo = async (req, res) => {
  try {
    const { nombre, descripcion, metodo_pago, imagen_url, fecha_inicio, fecha_fin, estado } = req.body;

    const [result] = await db.execute(
      `INSERT INTO sorteos (nombre, descripcion, metodo_pago, imagen_url, fecha_inicio, fecha_fin, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, metodo_pago, imagen_url, fecha_inicio, fecha_fin, estado || 'pendiente']
    );

    res.status(201).json({
      message: "✅ Sorteo creado exitosamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear sorteo:", error);
    res.status(500).json({ message: "❌ Error al crear sorteo", error });
  }
};

// Actualizar estado del sorteo
exports.updateSorteoEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE sorteos SET estado = ? WHERE id = ?",
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sorteo no encontrado" });
    }

    res.json({ message: "✅ Estado del sorteo actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar sorteo", error });
  }
};
