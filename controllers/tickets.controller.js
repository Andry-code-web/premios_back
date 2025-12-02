const db = require("../db/connection");

// Obtener todos los tickets
exports.getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, 
              c.nombres, c.apellidos, c.dni, c.celular, c.email,
              s.nombre AS sorteo_nombre
       FROM tickets t
       JOIN clientes c ON t.cliente_id = c.id
       JOIN sorteos s ON t.sorteo_id = s.id
       ORDER BY t.fecha_compra DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tickets", error });
  }
};

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

// Crear/Asignar ticket a un cliente
exports.createTicket = async (req, res) => {
  try {
    const { cliente_id, sorteo_id, monto, metodo_pago, comprobante_url } = req.body;

    // Validar campos requeridos
    if (!cliente_id || !sorteo_id || !monto || !metodo_pago) {
      return res.status(400).json({
        message: "Faltan campos requeridos: cliente_id, sorteo_id, monto, metodo_pago"
      });
    }

    // Normalizar método de pago a mayúsculas
    const metodoPagoUpper = metodo_pago.toUpperCase();
    const prefijo = metodoPagoUpper === 'YAPE' ? 'YAPE' :
      metodoPagoUpper === 'PLIN' ? 'PLIN' : 'OTRO';

    // Obtener el último número de ticket para este método de pago
    const [lastTickets] = await db.query(
      `SELECT codigo_ticket FROM tickets 
       WHERE codigo_ticket LIKE ? 
       ORDER BY id DESC LIMIT 1`,
      [`${prefijo}-%`]
    );

    // Calcular el siguiente número
    let siguienteNumero = 1;
    if (lastTickets.length > 0) {
      const ultimoCodigo = lastTickets[0].codigo_ticket;
      const numeroActual = parseInt(ultimoCodigo.split('-')[1]);
      siguienteNumero = numeroActual + 1;
    }

    // Generar código con formato: YAPE-0001, PLIN-0001, OTRO-0001
    const codigo_ticket = `${prefijo}-${siguienteNumero.toString().padStart(4, '0')}`;

    // Insertar ticket
    const [result] = await db.execute(
      `INSERT INTO tickets (codigo_ticket, cliente_id, sorteo_id, monto, metodo_pago, comprobante_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo_ticket, cliente_id, sorteo_id, monto, metodo_pago, comprobante_url || null]
    );

    res.status(201).json({
      message: "✅ Ticket asignado exitosamente",
      id: result.insertId,
      codigo_ticket: codigo_ticket
    });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ message: "❌ Error al crear ticket", error });
  }
};