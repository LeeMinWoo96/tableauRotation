// config/dbConfig.js
import dotenv from 'dotenv';

dotenv.config();

const dbconfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

export default dbconfig;
