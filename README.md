# AssuredGig Backend

A robust backend API for the AssuredGig freelancing platform, built with Node.js, Express, and Sequelize.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## Features
- 🔐 Authentication & Authorization
- 👥 User Management
- 💼 Job Posting & Management
- 📝 Application Processing
- 📄 Contract Management
- 📅 Meeting Scheduling
- 📊 Work Progress Tracking
- 🎯 Portfolio Management
- 📈 Dashboard Analytics

## Tech Stack
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Bcrypt for Password Hashing
- Multer for File Uploads
- Nodemailer for Email Notifications

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/assuredgig-backend.git
cd assuredgig-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (see Environment Variables section)

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assuredgig
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE assuredgig;
```

2. Run migrations:
```bash
npm run migrate
```

3. Seed the database (optional):
```bash
npm run seed
```

## API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "role": "client" | "freelancer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Job APIs

#### Create Job
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "budget": number,
  "deadline": "date",
  "skills": ["string"],
  "category": "string"
}
```

#### Get All Jobs
```http
GET /api/jobs?page=1&limit=10&category=string&search=string
```

#### Get Job Details
```http
GET /api/jobs/:id
```

#### Update Job
```http
PUT /api/jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "budget": number,
  "deadline": "date",
  "skills": ["string"],
  "category": "string"
}
```

#### Delete Job
```http
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

### Application APIs

#### Submit Application
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "string",
  "proposal": "string",
  "bidAmount": number
}
```

#### Get Applications
```http
GET /api/applications?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Application Status
```http
PATCH /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted" | "rejected"
}
```

### Contract APIs

#### Create Contract
```http
POST /api/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "string",
  "terms": "string",
  "startDate": "date",
  "endDate": "date",
  "paymentSchedule": "string"
}
```

#### Get Contracts
```http
GET /api/contracts?status=active&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Contract Status
```http
PATCH /api/contracts/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active" | "completed" | "terminated"
}
```

### Meeting APIs

#### Schedule Meeting
```http
POST /api/meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "contractId": "string",
  "title": "string",
  "description": "string",
  "startTime": "datetime",
  "endTime": "datetime",
  "participantId": "string"
}
```

#### Get Meetings
```http
GET /api/meetings
Authorization: Bearer <token>
```

#### Update Meeting Status
```http
PATCH /api/meetings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "scheduled" | "completed" | "cancelled"
}
```

### Work Progress APIs

#### Submit Progress
```http
POST /api/work-progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "contractId": "string",
  "description": "string",
  "percentage": number,
  "attachments": ["string"]
}
```

#### Get Progress
```http
GET /api/work-progress?contractId=string&page=1&limit=10
Authorization: Bearer <token>
```

### Portfolio APIs

#### Create Portfolio
```http
POST /api/portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "skills": ["string"],
  "projects": [{
    "title": "string",
    "description": "string",
    "url": "string",
    "image": "string"
  }]
}
```

#### Get Portfolio
```http
GET /api/portfolio/:userId
```

#### Update Portfolio
```http
PUT /api/portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "skills": ["string"],
  "projects": [{
    "title": "string",
    "description": "string",
    "url": "string",
    "image": "string"
  }]
}
```

### Dashboard APIs

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## Development

### Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── index.js        # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@assuredgig.com or join our Slack channel. 