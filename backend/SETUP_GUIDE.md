# Setup & Installation Guide - Restaurant Management System

## 🚀 Quick Start

Get your Restaurant Management System up and running in 5 minutes!

```bash
# 1. Clone the repository
git clone <repository-url>
cd restaurant-management-system

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Create admin user
npm run create-admin

# 5. Start the server
npm start
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 14.0 or higher
- **MongoDB**: Version 4.4 or higher
- **npm**: Version 6.0 or higher (or yarn)
- **Git**: For version control

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 18.04+
- ✅ CentOS 7+
- ✅ Docker (any OS)

---

## 🔧 Installation Methods

### Method 1: Local Installation (Recommended)

#### Step 1: Install Node.js
**Windows:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### Step 2: Install MongoDB
**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package index
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 3: Clone Repository
```bash
# Clone the repository
git clone <repository-url>
cd restaurant-management-system

# Or download ZIP and extract
```

#### Step 4: Install Dependencies
```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

#### Step 5: Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/restaurant_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Step 6: Database Setup
```bash
# Start MongoDB (if not already running)
mongod

# Create admin user
npm run create-admin
```

#### Step 7: Start the Server
```bash
# Development mode
npm start

# Or with auto-restart
npm run dev
```

#### Step 8: Verify Installation
```bash
# Test menu creation system
npm run test-menu

# Test API endpoints
npm run test-api
```

---

### Method 2: Docker Installation

#### Prerequisites
- Docker Desktop installed
- Docker Compose (included with Docker Desktop)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd restaurant-management-system
```

#### Step 2: Create Docker Compose File
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: restaurant-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: restaurant_db
    volumes:
      - mongodb_data:/data/db

  app:
    build: .
    container_name: restaurant-api
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/restaurant_db
      JWT_SECRET: your_super_secret_jwt_key_here_change_this_in_production
      JWT_EXPIRE: 30d
    depends_on:
      - mongodb
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  mongodb_data:
```

#### Step 3: Create Dockerfile
Create `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Step 4: Build and Run
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

### Method 3: Cloud Deployment

#### Heroku Deployment

**Step 1: Install Heroku CLI**
```bash
# Download from heroku.com or use package manager
npm install -g heroku
```

**Step 2: Login to Heroku**
```bash
heroku login
```

**Step 3: Create Heroku App**
```bash
heroku create your-restaurant-api
```

**Step 4: Add MongoDB Add-on**
```bash
heroku addons:create mongolab:sandbox
```

**Step 5: Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set JWT_EXPIRE=7d
```

**Step 6: Deploy**
```bash
git push heroku main
```

#### AWS Elastic Beanstalk

**Step 1: Install EB CLI**
```bash
pip install awsebcli
```

**Step 2: Initialize EB Application**
```bash
eb init
```

**Step 3: Create Environment**
```bash
eb create production
```

**Step 4: Deploy**
```bash
eb deploy
```

#### DigitalOcean App Platform

**Step 1: Create App Spec**
Create `.do/app.yaml`:

```yaml
name: restaurant-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/restaurant-management-system
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: your_production_jwt_secret
databases:
- name: mongodb
  engine: MONGODB
  version: "4.4"
```

**Step 2: Deploy**
```bash
doctl apps create --spec .do/app.yaml
```

---

## 🔧 Configuration

### Environment Variables

#### Required Variables
```env
NODE_ENV=development          # Environment (development/production)
PORT=5000                    # Server port
MONGODB_URI=mongodb://localhost:27017/restaurant_db  # Database URL
JWT_SECRET=your_secret_key   # JWT signing secret
JWT_EXPIRE=30d              # JWT expiration time
```

#### Optional Variables
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Configuration

#### MongoDB Connection Options
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

#### Database Indexes
```javascript
// Create indexes for better performance
await User.createIndexes();
await Menu.createIndexes();
await Order.createIndexes();
await Reservation.createIndexes();
await Inventory.createIndexes();
await Feedback.createIndexes();
```

---

## 🧪 Testing Setup

### Unit Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

### API Testing
```bash
# Install Postman CLI
npm install -g newman

# Run Postman collection
newman run Restaurant_API_Collection.json -e Restaurant_API_Environment.json
```

### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Ensure MongoDB is running: `mongod`
- Check MongoDB service: `sudo systemctl status mongod`
- Verify connection string in `.env`
- Check firewall settings

#### 2. Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```

**Solutions:**
- Change PORT in `.env` file
- Kill process using port: `lsof -ti:5000 | xargs kill -9`
- Use different port: `PORT=3001 npm start`

#### 3. JWT Token Error
```bash
Error: jwt malformed
```

**Solutions:**
- Check JWT_SECRET in `.env`
- Ensure JWT_SECRET is not empty
- Verify token format in requests

#### 4. Permission Denied
```bash
Error: EACCES: permission denied
```

**Solutions:**
- Check file permissions: `chmod 755 server.js`
- Run with sudo (not recommended)
- Fix npm permissions: `npm config set prefix ~/.npm-global`

#### 5. Module Not Found
```bash
Error: Cannot find module 'express'
```

**Solutions:**
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check package.json
- Verify Node.js version compatibility

### Debug Mode
```bash
# Enable debug logging
DEBUG=restaurant:* npm start

# Enable specific debug
DEBUG=restaurant:auth npm start
```

### Log Files
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# View access logs
tail -f logs/access.log
```

---

## 📊 Performance Optimization

### Production Optimizations

#### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

#### 2. Enable Caching
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache menu items
app.get('/api/menu', cache(300), getMenuItems);
```

#### 3. Database Optimization
```javascript
// Use connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

#### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🔒 Security Configuration

### Production Security

#### 1. Helmet.js
```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### 2. CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### 3. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/menu', [
  body('name').notEmpty().trim().escape(),
  body('price').isFloat({ min: 0 }),
  // ... more validations
], createMenuItem);
```

#### 4. Password Security
```javascript
// Use strong password requirements
const passwordSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
      },
      message: 'Password must contain uppercase, lowercase, number and special character'
    }
  }
});
```

---

## 📈 Monitoring & Logging

### Application Monitoring
```javascript
// Winston logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});
```

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});
```

---

## 🔄 Backup & Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --db restaurant_db --out ./backup/$(date +%Y%m%d)

# Restore from backup
mongorestore --db restaurant_db ./backup/20240101/restaurant_db
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME="restaurant_db"

mkdir -p $BACKUP_DIR

mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

---

## 📞 Support

### Getting Help
1. Check this documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Contact development team

### Reporting Issues
When reporting issues, include:
- Operating system and version
- Node.js version
- MongoDB version
- Error messages and logs
- Steps to reproduce
- Expected vs actual behavior

---

*Last updated: January 2024*
*Setup Guide Version: 1.0.0*
