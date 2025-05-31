# AssuredGig Backend

A Node.js backend for the AssuredGig freelancing platform.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (for local development)
- Aiven account (for production deployment)

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Initialize the database:
   ```bash
   npm run init-db
   ```
5. Seed the database with test data:
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Aiven PostgreSQL Setup

1. Create a new PostgreSQL service in Aiven
2. Get the connection details from Aiven dashboard
3. Update your `.env` file with the Aiven database credentials:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host.aivencloud.com
   DB_PORT=your_database_port
   ```

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```
4. Set environment variables in Vercel dashboard

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server
- `npm run test`: Run tests
- `npm run init-db`: Initialize the database
- `npm run seed`: Seed the database with test data

## Environment Variables

Required environment variables:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `CORS_ORIGIN`: Allowed CORS origin
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `JWT_SECRET`: JWT secret key

## Security Considerations

1. Always use HTTPS in production
2. Keep your JWT secret secure
3. Use strong passwords for database access
4. Regularly update dependencies
5. Monitor application logs 