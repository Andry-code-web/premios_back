const db = require("../db/connection");

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
};

// Buscar cliente por DNI
exports.getClienteByDni = async (req, res) => {
  const { dni } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM clientes WHERE dni = ?", [dni]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar cliente", error });
  }
};

// Crear cliente nuevo
exports.createCliente = async (req, res) => {
  try {
    const { dni, nombres, apellidos, celular, email } = req.body;

    console.log(req.body);
    

    // Validar campos requeridos
    const camposFaltantes = [];
    if (!dni) camposFaltantes.push("dni");
    if (!nombres) camposFaltantes.push("nombres");
    if (!apellidos) camposFaltantes.push("apellidos");
    if (!celular) camposFaltantes.push("celular");
    if (!email) camposFaltantes.push("email");
    if (!req.file) camposFaltantes.push("voucher");

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan los siguientes campos: ${camposFaltantes.join(", ")}`
      });
    }

    // Convertir imagen a Base64
    const voucherBase64 = req.file.buffer.toString("base64");

    // Insertar en la base de datos
    const [result] = await db.execute(
      `INSERT INTO clientes (dni, nombres, apellidos, celular, email, voucher)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dni, nombres, apellidos, celular, email, voucherBase64]
    );

    res.status(201).json({
      message: "✅ Cliente creado exitosamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "❌ Error al crear cliente", error });
  }
};

