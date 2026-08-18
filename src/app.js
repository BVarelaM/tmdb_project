const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Import main routes presentation layer
const userRoutes = require('./presentation/routes/userRoutes');
const movieRoutes = require('./presentation/routes/movieRoutes');
// const apiRoutes = require('./presentation/routes');

const app = express();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
//app.use('/api/movies', movieRoutes);
// app.use('/api', apiRoutes);

module.exports = app;