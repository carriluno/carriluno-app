const express = require('express');
const app = express();
const port = 3000; // El puerto interno donde correrá la aplicación

// Esta es una "ruta". Cuando alguien visite la página principal "/", 
// nuestro servidor responderá con este mensaje.
app.get('/', (req, res) => {
  res.send('¡Hola, Carriluno! El servidor está funcionando.');
});

// Le decimos al servidor que empiece a escuchar peticiones en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor de Carriluno escuchando en http://localhost:${port}`);
});
