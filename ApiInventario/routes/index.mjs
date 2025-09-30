import express from 'express';
import jwt from 'jsonwebtoken';
import { productos, usuarios } from '../resources/data.mjs';

const router = express.Router();
const secretKey = 'tu_clave_secreta';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

router.get('/productos', (req, res) => {
  res.json(productos);
});

router.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

router.patch('/productos/:id/inventario', authenticateToken, (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  const { tipo, cantidad } = req.body;
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser un número positivo.' });
  }

  if (tipo === 'entrada') {
    producto.cantidad += cantidad;
    res.json(producto);
  } else if (tipo === 'salida') {
    if (producto.cantidad - cantidad >= producto.stockMinimo) {
      producto.cantidad -= cantidad;
      res.json(producto);
    } else {
      res.status(400).json({ message: 'No hay suficientes existencias para realizar la salida.' });
    }
  } else {
    res.status(400).json({ message: 'El tipo de movimiento debe ser \'entrada\' o \'salida\'.' });
  }
});

export default router;
