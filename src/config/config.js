require('dotenv').config();

const config = {
  development: {
    database: {
      name: process.env.DB_NAME || 'assuredgig',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '24h'
    },
    server: {
      port: process.env.PORT || 3000,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  },
  production: {
    database: {
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    server: {
      port: process.env.PORT || 3000,
      corsOrigin: process.env.CORS_ORIGIN
    }
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env]; 