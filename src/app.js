const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const user = require('./routes/user');
const fileRoutes = require('./routes/file');
const { DB_URL, PORT } = require('./constants');
const cors = require('cors'); 
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(cors({
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/api/user', user);
app.use('/api/files', fileRoutes);

mongoose
  .connect(DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
