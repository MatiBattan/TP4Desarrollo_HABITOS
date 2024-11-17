const express = require('express');
const cors = require('cors');
const { sequelize } = require('../sequelize');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

app.use(cors()); 

app.use(express.json());

const usuarioRoutes = require('./routes/usuarios');
const habitoRoutes = require('./routes/habitos');
const progresoRoutes = require('./routes/progresos');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/habitos', authenticateToken, habitoRoutes);
app.use('/api/progresos', authenticateToken, progresoRoutes);

app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

module.exports = app;
