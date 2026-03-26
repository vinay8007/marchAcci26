const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api',userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .catch((err) => console.error('Could not connect to MongoDB', err))
  .then(() => console.log('connected to MongoDB'));

app.listen(3000, () => {
    console.log('User API is running on port 3000');
});