require('dotenv').config();
const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');
app.use(express.json());

const connectDB = require('./config/db');
connectDB();


// routes
app.use('/api/v1.0/moviebooking/', userRouter);
app.use('/api/v1.0/moviebooking/', movieRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening to PORT ${PORT}\nhttp://localhost:${PORT}`))