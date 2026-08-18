const express = require('express');
const cors = require('cors');

// Importar rutas principales de la capa presentation
// const apiRoutes = require('./presentation/routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
// app.use('/api', apiRoutes);

module.exports = app;