require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const urlRouter = require('./routes/url');
app.use('/', urlRouter);

// Health check route
app.get('/', (req, res) => {
  res.send('URL Shortener API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 