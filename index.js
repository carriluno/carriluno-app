const express = require('express');
const db = require('./config'); // Importamos nuestra configuración de la base de datos
const app = express();
const port = 3000;

// Ruta de prueba para verificar la conexión a la BD
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()'); // Hacemos una consulta simple: pedir la hora actual
    res.send(`Conexión a la base de datos exitosa. Hora del servidor de BD: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

app.get('/', (req, res) => {
  res.send('¡Hola, Carriluno! El servidor está funcionando.');
});

app.listen(port, () => {
  console.log(`Servidor de Carriluno escuchando en http://localhost:${port}`);
});
