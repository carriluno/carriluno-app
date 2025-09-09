const express = require('express');
const db = require('./config');
const userRoutes = require('./routes/users'); // Importamos nuestras nuevas rutas

const app = express();
const port = 3000;

// Middleware para que Express entienda JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Carriluno!');
});

// Usamos las rutas de usuario bajo el prefijo /api/users
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Servidor de Carriluno escuchando en http://localhost:${port}`);
});