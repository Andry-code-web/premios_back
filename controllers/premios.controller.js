const db = require("../db/connection");

// Obtenemos todas los premios
exports.getAllPremios = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM premios");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener premios:", error);
        res.status(500).json({ error: "Error al obtener premios" });
    }
};

// Crear premio nuevo
exports.createPremio = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validar que el nombre esté presente
        if (!nombre) {
            return res.status(400).json({
                error: "El campo 'nombre' es obligatorio"
            });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({
                error: "La imagen es obligatoria"
            });
        }

        // Convertir la imagen a base64
        const imagen_1 = req.file.buffer.toString("base64");

        const [result] = await db.execute(
            `INSERT INTO premios (nombre, imagen_1) VALUES (?, ?)`,
            [nombre, imagen_1]
        );

        res.status(201).json({
            message: "✅ Premio creado exitosamente",
            id: result.insertId,
        });
    } catch (error) {
        console.error("Error al crear premio:", error);
        res.status(500).json({
            error: "Error al crear premio",
            details: error.message
        });
    }
};