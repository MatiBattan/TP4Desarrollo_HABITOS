const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const { Usuario } = require('../../sequelize/index');
const { manejarError } = require('../helpers');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/tokenManager');

const SECRET_KEY = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  try {
    console.log('Datos recibidos en /register:', req.body);
    
    const { nombre, email, contraseña } = req.body;
    if (!nombre || !email || !contraseña) {
      console.error('Faltan campos en la solicitud');
      return res.status(400).json({ error: 'Faltan campos' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, contraseña: hashedPassword });
    console.log('Usuario registrado exitosamente:', nuevoUsuario);

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
});

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    manejarError(res, error, 'Error al obtener la lista de usuarios');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    manejarError(res, error, 'Error al obtener el usuario');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    console.log(`Intentando iniciar sesión con email: ${email}`);

    const usuarioEncontrado = await Usuario.findOne({
      where: { email: { [Op.eq]: email } }
    });

    if (!usuarioEncontrado) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
    if (!validPassword) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generateToken(usuarioEncontrado);
    console.log('Inicio de sesión exitoso');
    res.json({ token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
