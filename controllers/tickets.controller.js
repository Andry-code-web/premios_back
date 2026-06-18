const db = require("../db/connection");

// Obtener todos los tickets
exports.getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, 
              c.nombres, c.apellidos, c.dni, c.celular, c.email,
              'Sorteo General' AS sorteo_nombre
       FROM tickets t
       JOIN clientes c ON t.cliente_id = c.id
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
      `SELECT t.*, 'Sorteo General' AS sorteo
       FROM tickets t
       JOIN clientes c ON t.cliente_id = c.id
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
  const conn = await db.getConnection();
  try {
    const { cliente_id, cantidad_tickets, monto, metodo_pago, comprobante_url } = req.body;

    console.log(req.body);

    // Validar campos requeridos
    if (!cliente_id || !cantidad_tickets || !monto || !metodo_pago) {
      conn.release();
      return res.status(400).json({
        message: "Faltan campos requeridos: cliente_id, cantidad_tickets, monto, metodo_pago"
      });
    }

    // Normalizar método de pago a mayúsculas
    const metodoPagoUpper = metodo_pago.toUpperCase();
    const prefijo = metodoPagoUpper === 'YAPE' ? 'YAPE' :
      metodoPagoUpper === 'PLIN' ? 'PLIN' : 'OTRO';

    await conn.beginTransaction();

    const [[counter]] = await conn.query(
      `SELECT ultimo_numero
   FROM ticket_counters
   WHERE prefijo = ?
   FOR UPDATE`,
      [prefijo]
    );

    const nuevoNumero = counter.ultimo_numero + 1;

    await conn.execute(
      `UPDATE ticket_counters
   SET ultimo_numero = ?
   WHERE prefijo = ?`,
      [nuevoNumero, prefijo]
    );

    const codigo_ticket = `${prefijo}-${nuevoNumero.toString().padStart(4, '0')}`;

    // 3) Insertar el ticket con el código único generado
    const [result] = await conn.execute(
      `INSERT INTO tickets (codigo_ticket, cliente_id, cantidad_tickets, monto, metodo_pago, comprobante_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo_ticket, cliente_id, cantidad_tickets, monto, metodo_pago, comprobante_url || null]
    );

    await conn.commit();

    res.status(201).json({
      message: "✅ Ticket asignado exitosamente",
      id: result.insertId,
      codigo_ticket: codigo_ticket
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al crear ticket:", error);
    res.status(500).json({ message: "❌ Error al crear ticket", error });
  } finally {
    conn.release();
  }
};