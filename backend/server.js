const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (replace with your specific origin in production)
app.use(cors());

// Middleware
app.use(express.json()); //handles the request in json format

// Database connection (replace with your actual MongoDB URI)
const DB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/tablesprint';

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes (we will add these later)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// ... other routes ...

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
