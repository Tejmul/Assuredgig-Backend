# AssuredGig Backend

A robust backend system for a freelancing platform that connects clients with skilled freelancers. This platform facilitates job posting, application management, contract creation, and real-time communication between clients and freelancers.

## Features

### 1. User Management
- User registration and authentication
- Role-based access control (Client/Freelancer)
- Profile management
- Portfolio creation and management

### 2. Job Management
- Job posting by clients
- Job search and filtering
- Job matching based on freelancer skills
- Job application system

### 3. Application System
- Freelancers can apply to jobs
- Clients can review applications
- Application status tracking
- Portfolio review during application

### 4. Contract Management
- Contract creation after application acceptance
- Contract terms and conditions
- Contract status tracking
- Work progress tracking

### 5. Meeting System
- Schedule meetings between clients and freelancers
- Meeting reminders
- Meeting history
- Video conferencing integration

### 6. Work Progress Tracking
- Freelancers can update work progress
- Time tracking
- Progress reports
- Client approval system

### 7. Real-time Communication
- One-on-one chat between clients and freelancers
- Real-time notifications
- Message history
- File sharing

### 8. Notification System
- Real-time notifications using Socket.IO
- Email notifications
- In-app notifications
- Customizable notification preferences
- Multiple notification types:
  - Job matches
  - Application updates
  - Contract updates
  - Meeting reminders
  - Work progress updates
  - Messages

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Socket.IO
- JWT Authentication
- Nodemailer

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

3. Create a `.env` file in the root directory with the following variables:
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
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:3001

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

4. Initialize the database:
```bash
npm run db:init
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/             # Configuration files
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
└── index.js           # Application entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user profile

### Jobs
- GET `/api/jobs` - Get all jobs
- POST `/api/jobs` - Create a new job
- GET `/api/jobs/:id` - Get job details
- PUT `/api/jobs/:id` - Update a job
- DELETE `/api/jobs/:id` - Delete a job

### Applications
- POST `/api/applications` - Submit an application
- GET `/api/applications` - Get user's applications
- PUT `/api/applications/:id` - Update application status

### Contracts
- POST `/api/contracts` - Create a contract
- GET `/api/contracts` - Get user's contracts
- PUT `/api/contracts/:id` - Update contract status

### Meetings
- POST `/api/meetings` - Schedule a meeting
- GET `/api/meetings` - Get user's meetings
- PUT `/api/meetings/:id` - Update meeting details

### Work Progress
- POST `/api/work-progress` - Update work progress
- GET `/api/work-progress` - Get work progress history

### Notifications
- GET `/api/notifications` - Get user's notifications
- PATCH `/api/notifications/read` - Mark notifications as read
- PATCH `/api/notifications/preferences` - Update notification preferences

### Chat
- GET `/api/chat` - Get chat history
- POST `/api/chat` - Send a message

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "role": "freelancer"
}
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "freelancer",
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "freelancer",
  "token": "jwt_token"
}
```

### Jobs

#### Create Job
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Frontend Developer Needed",
  "description": "Looking for an experienced frontend developer...",
  "budget": 5000,
  "deadline": "2024-12-31",
  "skills": ["React", "TypeScript", "TailwindCSS"],
  "category": "Web Development"
}
```

Response:
```json
{
  "id": "uuid",
  "title": "Frontend Developer Needed",
  "description": "Looking for an experienced frontend developer...",
  "budget": 5000,
  "deadline": "2024-12-31",
  "skills": ["React", "TypeScript", "TailwindCSS"],
  "category": "Web Development",
  "status": "open",
  "clientId": "uuid",
  "createdAt": "2024-03-20T10:00:00Z"
}
```

### Applications

#### Submit Application
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "uuid",
  "proposal": "I am interested in this project...",
  "bidAmount": 4500,
  "estimatedDuration": "2 months"
}
```

Response:
```json
{
  "id": "uuid",
  "jobId": "uuid",
  "freelancerId": "uuid",
  "proposal": "I am interested in this project...",
  "bidAmount": 4500,
  "estimatedDuration": "2 months",
  "status": "pending",
  "createdAt": "2024-03-20T10:00:00Z"
}
```

### Real-time Communication

#### Socket.IO Connection
```javascript
// Frontend example
const socket = io('http://localhost:3002', {
  auth: {
    token: 'jwt_token'
  }
});

// Listen for notifications
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
});

// Send a message
socket.emit('message', {
  recipientId: 'uuid',
  content: 'Hello!',
  type: 'text'
});
```

## Notification System

The notification system supports multiple channels:

1. **In-app Notifications**
   - Stored in database
   - Real-time delivery
   - Mark as read functionality
   - Notification history

2. **Email Notifications**
   - HTML email templates
   - Customizable content
   - Action links
   - Responsive design

3. **Push Notifications**
   - Real-time delivery
   - Customizable preferences
   - Multiple notification types

## Troubleshooting Guide

### Common Issues and Solutions

1. **Database Connection Issues**
   ```bash
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```
   Solution:
   - Check if PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Authentication Errors**
   ```bash
   Error: Invalid token
   ```
   Solution:
   - Check JWT_SECRET in .env
   - Ensure token is being sent in Authorization header
   - Verify token hasn't expired

3. **Socket.IO Connection Issues**
   ```bash
   Error: Authentication error
   ```
   Solution:
   - Verify token is being sent in socket connection
   - Check CORS settings
   - Ensure Socket.IO server is running

4. **Email Sending Issues**
   ```bash
   Error: Invalid login
   ```
   Solution:
   - Verify SMTP credentials
   - Check if SMTP server allows less secure apps
   - Ensure correct SMTP port

### Development Tips

1. **Debugging**
   ```bash
   # Enable debug logs
   DEBUG=* npm run dev
   
   # Check database queries
   DEBUG=sequelize npm run dev
   ```

2. **Database Management**
   ```bash
   # Reset database
   npm run db:reset
   
   # Run migrations
   npm run db:migrate
   
   # Seed data
   npm run db:seed
   ```

3. **Testing**
   ```bash
   # Run all tests
   npm test
   
   # Run specific test file
   npm test -- tests/auth.test.js
   ```

## Development Workflow

1. **Setting Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Set up pre-commit hooks
   npm run setup-hooks
   
   # Start development server
   npm run dev
   ```

2. **Code Style**
   - Use ESLint for code linting
   - Follow the project's coding standards
   - Write meaningful commit messages

3. **Git Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature
   
   # Make changes and commit
   git add .
   git commit -m "feat: add new feature"
   
   # Push changes
   git push origin feature/new-feature
   ```

4. **Pull Request Process**
   - Create PR from feature branch to main
   - Ensure all tests pass
   - Get code review
   - Address review comments
   - Merge after approval

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@assuredgig.com or create an issue in the repository. 