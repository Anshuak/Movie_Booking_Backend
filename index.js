require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Path to your swagger.js file
const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');
const ticketRouter = require('./routes/ticketRouter');
const { consumeMessages } = require('./kafka/kafkaConsumer.js');


app.use(express.json());

const connectDB = require('./config/db');
connectDB();

// kafka consumer
consumeMessages().catch(console.error);

// routes
app.use('/api/v1.0/moviebooking/', userRouter);
app.use('/api/v1.0/moviebooking/', movieRouter);
app.use('/api/v1.0/moviebooking/', ticketRouter);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}\nhttp://localhost:${PORT} and swagger on 8000/api-docs`))