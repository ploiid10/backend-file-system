const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/app';
const PORT = process.env.PORT || 3000
const SECRET_KEY= process.env.SECRET_KEY || 'secretpassword'


module.exports = {
  DB_URL,
  PORT,
  SECRET_KEY
}