require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('Falta definir JWT_SECRET en el archivo .env');
}

const users = [];

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡El servidor está funcionando correctamente!');
});

// Registro de usuario
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son obligatorios.' });
    }

    const userExists = users.find(u => u.username === username);
    if (userExists) {
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword
    };

    users.push(newUser);

    console.log('Usuario registrado:', { username: newUser.username });

    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ error: 'Error interno al registrar usuario.' });
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son obligatorios.' });
    }

    const userDb = users.find(u => u.username === username);
    if (!userDb) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const payload = {
      username: userDb.username,
      rol: 'usuario'
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ error: 'Error interno al iniciar sesión.' });
  }
});

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payloadDecodificado = jwt.verify(token, SECRET);
    req.usuario = payloadDecodificado;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
}

// Ruta protegida
app.get('/perfil', verificarToken, (req, res) => {
  return res.json({
    mensaje: 'Acceso concedido al perfil',
    usuario: req.usuario
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});