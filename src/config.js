import dotenv from 'dotenv';

dotenv.config();

const config = {
  dbConfig: {
    userName: process.env.MONG_DB_USERNAME,
    password: process.env.MONG_DB_PASSWORD,
    dbName: process.env.MONG_DB_NAME,
  },
  bcryt: {
    salt: 10,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRE_IN,
  },
};

export default config;
