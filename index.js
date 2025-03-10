require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Path to your swagger.js file
const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');
const ticketRouter = require('./routes/ticketRouter');
app.use(express.json());
app.use(require('cors')());

const connectDB = require('./config/db');
connectDB();

// routes
app.use('/api/v1.0/moviebooking/', userRouter);
app.use('/api/v1.0/moviebooking/', movieRouter);
app.use('/api/v1.0/moviebooking/', ticketRouter);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}\nhttp://localhost:${PORT}`))

module.exports = app;