const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config'); // .. para subir un nivel y encontrar config.js

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Guardar en la base de datos
    const newUser = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING user_id, email, role",
      [email, password_hash, role || 'competitor']
    );

    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // ---- NUEVO CÓDIGO PARA CREAR EL TOKEN ----
    const payload = {
      user: {
        id: user.user_id,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    res.status(200).json({ token }); // Devolvemos el token

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// GET /api/users/profile - Ruta Protegida
router.get('/profile', auth, async (req, res) => {
  try {
    // El middleware 'auth' ya verificó el token y nos dio req.user
    const userQuery = await db.query("SELECT user_id, email, role, created_at FROM users WHERE user_id = $1", [req.user.id]);
    res.json(userQuery.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;