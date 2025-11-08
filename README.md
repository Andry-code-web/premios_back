# premios_back

API REST para gestionar sorteos: clientes, tickets y ganadores.

## Descripción

Proyecto Node.js/Express que expone endpoints para administrar clientes, tickets y la selección/registro de ganadores en sorteos.

Este repositorio contiene la API backend. Las rutas principales están separadas por entidad (`clientes`, `tickets`, `ganadores`) y los controladores están en la carpeta `controllers/`.

## Estructura del repositorio (resumen)

- `server.js` - punto de entrada del servidor
- `package.json` - dependencias y scripts
- `Procfile` - despliegue (Heroku)
- `db/connection.js` - lógica de conexión a base de datos
- `controllers/` - controladores de cada entidad
- `routes/` - rutas para `clientes`, `tickets`, `ganadores`

## Requisitos

- Node.js 14+ (recomendado Node.js 16+)
- Una base de datos (revisar `db/connection.js` para saber qué motor usar y variables esperadas)

## Instalación (Windows - PowerShell)

1. Clonar el repositorio y entrar en la carpeta del proyecto.
2. Instalar dependencias:

```powershell
npm install
```

## Configuración

Crea un archivo `.env` en la raíz con, como mínimo, las siguientes variables (ajusta según tu `db/connection.js`):

```
PORT=3000
DATABASE_URL=<cadena-de-conexión>
```

Si usas otro motor (MySQL, Postgres, MongoDB), adapta la cadena de conexión y dependencias.

## Uso / Ejecución

Iniciar la API en modo producción/desarrollo:

```powershell
npm start
# o
node server.js
```

Si quieres usar nodemon en desarrollo, instala nodemon globalmente o como devDependency y luego ejecuta `nodemon server.js`.

## Rutas principales (resumen)

Revisa los archivos en `routes/` para confirmar parámetros y paths exactos. Ejemplos generales:

- Clientes: `GET /api/clientes`, `POST /api/clientes`, `PUT /api/clientes/:id`, `DELETE /api/clientes/:id`
- Tickets: `GET /api/tickets`, `POST /api/tickets`, `PUT /api/tickets/:id`, `DELETE /api/tickets/:id`
- Ganadores: `GET /api/ganadores`, `POST /api/ganadores` (registro de ganador), etc.

Ejecuta `GET /` o revisa `server.js` para la ruta raíz y middleware registrados.

## Buenas prácticas y notas de desarrollo

- Añadir validaciones en los controladores (entrada y formato).
- Implementar manejo centralizado de errores.
- Considerar autenticación/roles si la API será pública.
- Añadir pruebas unitarias para controladores y rutas.

## Despliegue

El proyecto incluye `Procfile` para Heroku:

```
web: node server.js
```

Para otros proveedores, ajusta la configuración de acuerdo con la plataforma.

## Contribuir

1. Abrir un issue describiendo la mejora o bug.
2. Crear un branch, hacer cambios y abrir un Pull Request con descripción y pruebas cuando aplique.

## Licencia

Revisa el archivo `LICENSE` en la raíz del repositorio para conocer los términos.

```env
# Puerto en el que escuchará la API
PORT=3000

# Cadena de conexión a la base de datos (ajusta según tu motor)
# Ejemplo Mysql:
# DB_HOST=local
# DB_USER=user
# DB_PASSWORD=****
# DB_NAME=database
```

## Postman / Ejemplos de peticiones

Puedes importar ejemplos a Postman manualmente usando las peticiones curl o creando una colección nueva con las siguientes rutas. Sustituye `{{BASE_URL}}` por la URL de tu servidor (p.ej. `http://localhost:3000`).

Nota: revisa `routes/` para confirmar rutas exactas y parámetros.

### Clientes

- Obtener todos los clientes

curl:
```bash
curl -X GET "{{BASE_URL}}/api/clientes" -H "Accept: application/json"
```

- Crear un cliente (ejemplo JSON)

curl:
```bash
curl -X POST "{{BASE_URL}}/api/clientes" \
	-H "Content-Type: application/json" \
	-d '{"nombre":"Juan Pérez","email":"juan@example.com","telefono":"+34123456789"}'
```

Ejemplo body en Postman (raw JSON):
{
	"nombre": "Juan Pérez",
	"email": "juan@example.com",
	"telefono": "+34123456789"
}

### Tickets

- Obtener tickets

curl:
```bash
curl -X GET "{{BASE_URL}}/api/tickets" -H "Accept: application/json"
```

- Crear ticket (ejemplo JSON)

curl:
```bash
curl -X POST "{{BASE_URL}}/api/tickets" \
	-H "Content-Type: application/json" \
	-d '{"clienteId":"<id_cliente>","numero":"A-12345","comentarios":"Participación promo X"}'
```

Ejemplo body en Postman (raw JSON):
{
	"clienteId": "<id_cliente>",
	"numero": "A-12345",
	"comentarios": "Participación promo X"
}

### Ganadores

- Listar ganadores

curl:
```bash
curl -X GET "{{BASE_URL}}/api/ganadores" -H "Accept: application/json"
```

- Registrar ganador (ejemplo JSON)

curl:
```bash
curl -X POST "{{BASE_URL}}/api/ganadores" \
	-H "Content-Type: application/json" \
	-d '{"ticketId":"<id_ticket>","premio":"Smart TV 50\"","fecha":"2025-11-08"}'
```

Ejemplo body en Postman (raw JSON):
{
	"ticketId": "<id_ticket>",
	"premio": "Smart TV 50\"",
	"fecha": "2025-11-08"
}

### Cómo importar a Postman rápidamente

1. Abre Postman y crea una nueva colección.
2. Añade nuevas peticiones y pega los ejemplos curl o el body JSON mostrado arriba.
3. Crea una variable de entorno `BASE_URL` en Postman y pon `http://localhost:3000` (o la URL de tu servidor).

Si quieres, puedo generar y añadir un archivo JSON de colección de Postman (`postman_collection.json`) para que lo importes directamente. ¿Lo quieres ahora?
