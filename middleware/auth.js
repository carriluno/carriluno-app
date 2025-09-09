const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Obtener el token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, permiso denegado' });
  }

  // Verificar el token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next(); // Si el token es válido, pasa a la siguiente función
  } catch (err) {
    res.status(401).json({ message: 'El token no es válido' });
  }
};