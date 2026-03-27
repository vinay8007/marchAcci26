const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(express.json());
const corsOptions = {
    origin: 'https://task-manager-fronend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 mins
    max: 20,
    message: 'Too many requests from this IP, Please try again 5 minutes'
})
app.use(limiter);
app.use(cors(corsOptions));
  // handle preflight requests for all routes
  // No explicit app.options route: the global CORS middleware handles preflight
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use('/api', userRoutes);
app.use(errorMiddleware)

mongoose.connect(process.env.MONGO_API)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
    console.log('User API is running on port 3000')
});

