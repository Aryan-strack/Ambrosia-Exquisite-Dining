# Restaurant Management System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Authentication & Authorization](#authentication--authorization)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Testing Guide](#testing-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

---

## 🏪 Project Overview

The Restaurant Management System is a comprehensive backend API designed to manage all aspects of a restaurant business. It provides endpoints for menu management, order processing, inventory tracking, payment handling, reservations, feedback collection, and reporting.

### Key Capabilities:
- **Menu Management**: Create, read, update, delete menu items with categories and nutritional info
- **Order Processing**: Handle customer orders with real-time status updates
- **Inventory Management**: Track ingredients and stock levels
- **Payment Processing**: Integrated Stripe payment gateway
- **Reservation System**: Table booking and management
- **Feedback Collection**: Customer reviews and ratings
- **Reporting**: Analytics and business insights
- **User Management**: Role-based access control

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Staff, Chef, Admin)
- Password encryption with bcrypt
- Account activation/deactivation

### 📱 Menu Management
- CRUD operations for menu items
- Category-based organization (Starters, Main Course, Desserts, Drinks, Sides)
- Nutritional information tracking
- Ingredient management
- Preparation time tracking
- Availability status

### 🛒 Order Management
- Order creation and tracking
- Status updates (Pending, Confirmed, Preparing, Ready, Delivered)
- Order history
- Customer order management

### 📦 Inventory Management
- Stock level tracking
- Low stock alerts
- Ingredient management
- Supplier information

### 💳 Payment Processing
- Stripe integration
- Payment status tracking
- Refund handling
- Payment history

### 🍽️ Reservation System
- Table booking
- Time slot management
- Customer information
- Reservation status tracking

### 📊 Feedback & Reviews
- Customer feedback collection
- Rating system
- Review management
- Analytics

### 📈 Reporting
- Sales analytics
- Popular items
- Revenue tracking
- Performance metrics

---

## 🛠️ Technology Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Payment Processing
- **Stripe** - Payment gateway

### Email Services
- **Nodemailer** - Email notifications

### Development Tools
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **axios** - HTTP client for testing

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd restaurant-management-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
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

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Step 4: Database Setup
```bash
# Start MongoDB service
mongod

# Create admin user
npm run create-admin
```

### Step 5: Start Server
```bash
# Development mode
npm start

# Or with nodemon for auto-restart
npm run dev
```

### Step 6: Verify Installation
```bash
# Test menu creation system
npm run test-menu

# Test API endpoints
npm run test-api
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min: 6),
  role: String (enum: ['customer', 'staff', 'chef', 'admin']),
  phone: String (required for customers),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Menu Model
```javascript
{
  name: String (required),
  category: String (enum: ['starters', 'main-course', 'desserts', 'drinks', 'sides']),
  description: String (required),
  price: Number (required, min: 0),
  image: String (default: 'default-food.jpg'),
  ingredients: [{
    name: String,
    quantity: String
  }],
  preparationTime: Number (required, in minutes),
  isAvailable: Boolean (default: true),
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  customer: ObjectId (ref: User),
  items: [{
    menuItem: ObjectId (ref: Menu),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  deliveryAddress: String,
  specialInstructions: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation Model
```javascript
{
  customer: ObjectId (ref: User),
  tableNumber: String,
  reservationDate: Date,
  reservationTime: String,
  partySize: Number,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Model
```javascript
{
  name: String (required),
  category: String,
  currentStock: Number (required),
  minimumStock: Number (required),
  unit: String (required),
  supplier: String,
  costPerUnit: Number,
  lastRestocked: Date,
  expiryDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Model
```javascript
{
  customer: ObjectId (ref: User),
  order: ObjectId (ref: Order),
  rating: Number (min: 1, max: 5),
  comment: String,
  category: String (enum: ['food', 'service', 'ambiance', 'delivery']),
  isAnonymous: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "1234567890"
}
```

#### POST /auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /auth/logout
Logout user (requires authentication)

#### GET /auth/me
Get current user profile (requires authentication)

### Menu Endpoints

#### GET /menu/
Get all menu items with optional filters
```
Query Parameters:
- category: Filter by category
- available: Filter by availability (true/false)
- page: Page number (default: 1)
- limit: Items per page (default: 10)
```

#### GET /menu/categories
Get all available categories

#### GET /menu/:id
Get single menu item by ID

#### POST /menu/
Create new menu item (Admin only)
```json
{
  "name": "Chicken Burger",
  "category": "main-course",
  "description": "Delicious grilled chicken burger",
  "price": 15.99,
  "preparationTime": 20,
  "ingredients": [
    {"name": "Chicken Patty", "quantity": "1 piece"},
    {"name": "Lettuce", "quantity": "2 leaves"}
  ],
  "nutritionalInfo": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 20
  }
}
```

#### PUT /menu/:id
Update menu item (Admin only)

#### DELETE /menu/:id
Delete menu item (Admin only)

### Order Endpoints

#### GET /orders/
Get all orders (Admin/Staff only)

#### GET /orders/my
Get current user's orders

#### GET /orders/:id
Get single order by ID

#### POST /orders/
Create new order
```json
{
  "items": [
    {
      "menuItem": "menu_item_id",
      "quantity": 2,
      "price": 15.99
    }
  ],
  "deliveryAddress": "123 Main St, City",
  "specialInstructions": "Extra spicy"
}
```

#### PUT /orders/:id/status
Update order status (Admin/Staff only)

### Reservation Endpoints

#### GET /reservations/
Get all reservations (Admin/Staff only)

#### GET /reservations/my
Get current user's reservations

#### POST /reservations/
Create new reservation
```json
{
  "tableNumber": "T1",
  "reservationDate": "2024-01-15",
  "reservationTime": "19:00",
  "partySize": 4,
  "specialRequests": "Window table preferred"
}
```

#### PUT /reservations/:id
Update reservation

#### DELETE /reservations/:id
Cancel reservation

### Inventory Endpoints

#### GET /inventory/
Get all inventory items (Admin/Staff only)

#### POST /inventory/
Add new inventory item (Admin only)
```json
{
  "name": "Chicken Breast",
  "category": "Meat",
  "currentStock": 50,
  "minimumStock": 10,
  "unit": "kg",
  "supplier": "Fresh Foods Ltd",
  "costPerUnit": 8.50
}
```

#### PUT /inventory/:id
Update inventory item (Admin only)

#### DELETE /inventory/:id
Delete inventory item (Admin only)

### Payment Endpoints

#### POST /payments/create-payment-intent
Create Stripe payment intent
```json
{
  "amount": 1599,
  "currency": "usd",
  "orderId": "order_id"
}
```

#### POST /payments/confirm-payment
Confirm payment
```json
{
  "paymentIntentId": "pi_xxx",
  "orderId": "order_id"
}
```

### Feedback Endpoints

#### GET /feedback/
Get all feedback (Admin only)

#### POST /feedback/
Submit feedback
```json
{
  "order": "order_id",
  "rating": 5,
  "comment": "Excellent food and service!",
  "category": "food"
}
```

### Report Endpoints

#### GET /reports/sales
Get sales report (Admin only)

#### GET /reports/popular-items
Get popular items report (Admin only)

#### GET /reports/revenue
Get revenue report (Admin only)

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1643587200
}
```

### Authorization Header
```
Authorization: Bearer <jwt_token>
```

### Token Expiration
- Default: 30 days
- Configurable via `JWT_EXPIRE` environment variable

---

## 👥 User Roles & Permissions

### Customer
- View menu items
- Create orders
- Make reservations
- Submit feedback
- View own orders/reservations

### Staff
- All customer permissions
- View all orders
- Update order status
- View reservations
- Manage inventory (view only)

### Chef
- All staff permissions
- Update order status
- View menu items
- Manage inventory

### Admin
- Full system access
- Manage users
- CRUD menu items
- Manage inventory
- View reports
- Manage reservations
- Handle payments

---

## 🧪 Testing Guide

### Unit Testing
```bash
# Test menu creation system
npm run test-menu

# Test API endpoints
npm run test-api
```

### Postman Testing
1. Import `Restaurant_API_Collection.json`
2. Set up environment variables
3. Run collection tests

### Manual Testing
1. Create admin user: `npm run create-admin`
2. Start server: `npm start`
3. Test endpoints using Postman or curl

### Test Data
```bash
# Admin credentials
Email: superadmin@restaurant.com
Password: admin123
```

---

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Heroku**: Connect GitHub repository
- **AWS**: Use Elastic Beanstalk
- **DigitalOcean**: Use App Platform
- **Vercel**: Deploy as serverless functions

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
mongod --dbpath /path/to/your/db
```

#### JWT Token Error
```bash
Error: jwt malformed
```
**Solution**: Check JWT_SECRET in .env file

#### Permission Denied
```bash
Error: 403 Forbidden
```
**Solution**: Verify user role and permissions

#### Validation Error
```bash
Error: 400 Bad Request
```
**Solution**: Check required fields and data types

### Debug Mode
```bash
# Enable debug logging
DEBUG=restaurant:* npm start
```

### Log Files
- Application logs: Console output
- Error logs: Check server console
- Database logs: MongoDB logs

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Commit changes: `git commit -m 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Create Pull Request

### Code Standards
- Use ESLint for code formatting
- Follow RESTful API conventions
- Write comprehensive tests
- Document new endpoints
- Use meaningful commit messages

### Pull Request Process
1. Ensure all tests pass
2. Update documentation
3. Add test cases for new features
4. Request code review
5. Merge after approval

---

## 📞 Support

### Getting Help
- Check troubleshooting section
- Review API documentation
- Check GitHub issues
- Contact development team

### Bug Reports
When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Error messages/logs

### Feature Requests
- Describe the feature
- Explain use case
- Provide examples
- Consider implementation complexity

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🏆 Acknowledgments

- Express.js community
- MongoDB documentation
- Stripe API documentation
- JWT.io for token debugging
- Postman for API testing

---

## 📈 Future Enhancements

### Planned Features
- Real-time notifications
- Mobile app integration
- Advanced analytics dashboard
- Multi-language support
- Advanced reporting
- Integration with POS systems
- Loyalty program
- Delivery tracking

### Technical Improvements
- GraphQL API
- Microservices architecture
- Redis caching
- Message queues
- Automated testing
- CI/CD pipeline
- Performance monitoring

---

*Last updated: January 2024*
*Version: 1.0.0*
