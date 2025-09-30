import express from 'express';
import { productos } from '../resources/data.mjs';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/productos', (req, res) => {
  res.json(productos);
});

// Ruta para obtener un producto por ID
router.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

export default router;
