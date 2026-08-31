const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Import main routes presentation layer
const userRoutes = require('./presentation/routes/user');
const movieRoutes = require('./presentation/routes/movie');
const recommendationRoutes = require('./presentation/routes/recommendation');
// const apiRoutes = require('./presentation/routes');

const app = express();
app.use(helmet());

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // change url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/recommendations', recommendationRoutes);
// app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'internal server error'
  });
});

module.exports = app;