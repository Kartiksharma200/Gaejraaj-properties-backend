# 🚀 Backend API – Node.js + TypeScript

A production-ready, scalable backend API built with Node.js, TypeScript, Express, and MongoDB. Includes authentication, user management, security best practices, testing, logging, and Docker support.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ Features
- JWT Authentication (Register / Login / Logout)
- Helmet, CORS, Rate Limiting, Input Sanitization
- Request Validation Middleware
- MongoDB with Mongoose ODM
- Email Service (Welcome & Password Reset)
- Winston Logging with Daily Rotation
- Jest Unit & Integration Testing
- Docker & Docker Compose Support
- Clean REST API Architecture

## 📋 Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB (Local or Atlas)
- Git

## 🚀 Quick Start
git clone https://github.com/yourusername/backend.git
cd backend
npm install
cp .env.example .env

## ⚙️ Environment Variables
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/backend
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

## ▶️ Run Application
npm run dev
npm run build
npm start

Server: http://localhost:3000

## 🔍 Health Check
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "uptime": 123.45
}

## 📁 Project Structure
backend/
src/
config/
controllers/
middleware/
models/
routes/
services/
utils/
validations/
app.ts
server.ts
tests/
dist/
logs/
.env.example
docker-compose.yml
Dockerfile
tsconfig.json
package.json

## 🔧 Available Scripts
npm run dev
npm run build
npm start
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run format
npm run docker:build
npm run docker:run
npm run docker:compose

## 📚 API Endpoints
POST /auth/register
POST /auth/login
POST /auth/logout
GET /users
GET /users/profile
PUT /users/profile

Base URL:
http://localhost:3000/api/v1

## 🛡️ Security
- Helmet security headers
- CORS enabled
- Rate limiting
- Input sanitization
- JWT authentication
- bcrypt password hashing
- Environment variable protection

## 🐳 Docker
docker build -t backend-api .
docker run -p 3000:3000 --env-file .env backend-api
docker-compose up
docker-compose up -d
docker-compose logs -f
docker-compose down

## 🧪 Testing
npm test
npm run test:watch
npm run test:coverage

## 📊 Logging
Logs stored in logs/
error-*.log
combined-*.log

## 🔍 Debugging
kill -9 $(lsof -t -i:3000)
mongosh --eval "db.runCommand({ ping: 1 })"
npx tsc --noEmit

## 📦 Dependencies
express
mongoose
jsonwebtoken
bcryptjs
helmet
cors
dotenv
winston
typescript
jest
eslint
prettier

## 🤝 Contributing
Fork repository
Create feature branch
Commit changes
Push branch
Open Pull Request

## 📄 License
MIT License

## 👨‍💻 Author
Kartik Sharma
GitHub: https://github.com/Kartiksharma200

⭐ If you find this project useful, give it a star!
