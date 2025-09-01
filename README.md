# NestJS Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A comprehensive NestJS boilerplate with JWT authentication, role-based authorization, team management, and common utilities. This project provides a solid foundation for building scalable Node.js applications with modern best practices.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **Role-based access control** (RBAC) with guards and decorators
- **Email verification** using Brevo integration
- **Password reset** functionality with secure tokens
- **Protected routes** with JWT guards
- **Password hashing** with bcrypt

### 👥 User & Team Management
- **User registration and management**
- **Team creation and management** with limits per agency
- **Agency-based user roles**
- **Team membership tracking**

### 🛠️ Common Utilities
- **Global exception handling** with custom filters
- **Request/Response interceptors** for consistent API responses
- **Validation pipes** with detailed error messages
- **Logging middleware** for request tracking
- **Pagination support** with DTOs and transformers
- **Email service** integration with Brevo
- **Object ID utilities** for MongoDB

### 🏗️ Architecture
- **Modular structure** following NestJS best practices
- **Dependency injection** throughout the application
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Environment-based configuration**
- **Comprehensive error handling**
- **Unit and E2E testing** setup

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nest-boilerplate.git
   cd nest-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Application
   PORT=3000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/nest-boilerplate
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Email Service (Brevo)
   BREVO_API_KEY=your-brevo-api-key-here
   BREVO_VERIFICATION_TEMPLATE_ID=1
   BREVO_PASSWORD_RESET_TEMPLATE_ID=2
   
   # Email Configuration
   SENDER_EMAIL=noreply@yourdomain.com
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/verify-email` | Verify email address | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| GET | `/auth/profile` | Get user profile | Yes |

### Team Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/teams` | Create a new team | Yes (Agency) |
| GET | `/teams` | Get user's teams (paginated) | Yes (Agency) |
| GET | `/teams/count` | Get team count and limits | Yes (Agency) |
| GET | `/teams/:id` | Get team by ID | Yes (Agency) |
| PUT | `/teams/:id` | Update team | Yes (Agency) |
| DELETE | `/teams/:id` | Delete team | Yes (Agency) |

### Example API Usage

#### Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Create a Team (Protected Route)
```bash
curl -X POST http://localhost:3000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "name": "Development Team"
  }'
```

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data Transfer Objects
│   ├── decorators/         # Custom decorators (@CurrentUser)
│   ├── entities/           # Auth entities
│   ├── transformers/       # Response transformers
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module
├── user/                   # User management module
│   ├── dto/                # User DTOs
│   ├── entities/           # User entity
│   ├── transformers/       # User transformers
│   ├── user.controller.ts  # User endpoints
│   ├── user.service.ts     # User business logic
│   └── user.module.ts      # User module
├── team/                   # Team management module
│   ├── dto/                # Team DTOs
│   ├── entities/           # Team entity
│   ├── exceptions/         # Team-specific exceptions
│   ├── transformers/       # Team transformers
│   ├── types/              # Team types
│   ├── team.controller.ts  # Team endpoints
│   ├── team.service.ts     # Team business logic
│   └── team.module.ts      # Team module
├── common/                 # Shared utilities
│   ├── constants/          # Application constants
│   ├── decorators/         # Common decorators (@Roles)
│   ├── dto/                # Common DTOs (PaginationDto)
│   ├── exceptions/         # Custom exceptions
│   ├── filters/            # Exception filters
│   ├── guards/             # Auth guards (RolesGuard)
│   ├── interceptors/       # Request/Response interceptors
│   ├── logger/             # Logging utilities
│   ├── middleware/         # Custom middleware
│   ├── services/           # Shared services (EmailService)
│   ├── transformers/       # Common transformers
│   ├── types/              # Common types
│   └── utils/              # Utility functions
├── config/                 # Configuration
│   └── configuration.ts    # App configuration
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Application port | `3000` | No |
| `NODE_ENV` | Environment | `development` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `BREVO_API_KEY` | Brevo email service API key | - | Yes |
| `BREVO_VERIFICATION_TEMPLATE_ID` | Email verification template ID | - | Yes |
| `BREVO_PASSWORD_RESET_TEMPLATE_ID` | Password reset template ID | - | Yes |
| `SENDER_EMAIL` | Sender email address | - | Yes |
| `FRONTEND_URL` | Frontend application URL | - | Yes |
| `MAX_TEAMS_PER_AGENCY` | Maximum teams per agency | `30` | No |
| `SALT_ROUNDS` | Bcrypt salt rounds | `10` | No |

### Email Service Setup (Brevo)

1. Sign up for a [Brevo account](https://www.brevo.com/)
2. Get your API key from the Brevo dashboard
3. Create email templates for verification and password reset
4. Add the API key and template IDs to your `.env` file

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Environment Setup

1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Set up email service (Brevo)
4. Deploy to your preferred platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement rate limiting
- [ ] Add Redis caching
- [ ] Implement file upload functionality
- [ ] Add more authentication providers (Google, GitHub)
- [ ] Add database migrations
- [ ] Implement audit logging
- [ ] Add health checks and monitoring

## 🐛 Bug Reports

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 💡 Feature Requests

We welcome feature requests! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Brevo](https://www.brevo.com/) - Email service provider
- All contributors who help improve this project

## 📞 Support

- 📧 Email: support@yourdomain.com
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/nest-boilerplate/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nest-boilerplate/issues)

---

⭐ If you found this project helpful, please give it a star on GitHub!