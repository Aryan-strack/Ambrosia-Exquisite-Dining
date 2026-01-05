# User Guide & Examples - Restaurant Management System

## 👋 Welcome

This guide will help you understand how to use the Restaurant Management System effectively. Whether you're a customer, staff member, chef, or admin, this guide covers everything you need to know.

---

## 🎯 User Roles Overview

### 👤 Customer
- Browse menu items
- Place orders
- Make reservations
- Submit feedback
- View order history

### 👨‍💼 Staff
- All customer permissions
- View all orders
- Update order status
- Manage reservations
- View inventory

### 👨‍🍳 Chef
- All staff permissions
- Update order status
- View menu items
- Manage inventory

### 👑 Admin
- Full system access
- Manage all users
- CRUD menu items
- Manage inventory
- View reports
- Handle payments

---

## 🔐 Getting Started

### Step 1: Registration
Register a new account to get started:

**API Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Step 2: Login
Login with your credentials:

**API Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Step 3: Save Your Token
Save the JWT token for authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🍽️ Menu Management

### Browse Menu Items

#### Get All Menu Items
```bash
GET /api/menu/
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Chicken Burger",
      "category": "main-course",
      "description": "Delicious grilled chicken burger",
      "price": 15.99,
      "preparationTime": 20,
      "isAvailable": true
    }
  ]
}
```

#### Filter by Category
```bash
GET /api/menu/?category=main-course
```

#### Filter by Availability
```bash
GET /api/menu/?available=true
```

#### Search Menu Items
```bash
GET /api/menu/?search=chicken
```

### Get Menu Categories
```bash
GET /api/menu/categories
```

**Response:**
```json
{
  "success": true,
  "data": ["starters", "main-course", "desserts", "drinks", "sides"]
}
```

### Get Single Menu Item
```bash
GET /api/menu/60f7b3b3b3b3b3b3b3b3b3b3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Burger",
    "category": "main-course",
    "description": "Delicious grilled chicken burger with fresh vegetables",
    "price": 15.99,
    "image": "chicken-burger.jpg",
    "ingredients": [
      {"name": "Chicken Patty", "quantity": "1 piece"},
      {"name": "Lettuce", "quantity": "2 leaves"}
    ],
    "preparationTime": 20,
    "isAvailable": true,
    "nutritionalInfo": {
      "calories": 450,
      "protein": 25,
      "carbs": 35,
      "fat": 20
    }
  }
}
```

---

## 🛒 Order Management

### Place an Order

#### Create New Order
```bash
POST /api/orders/
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "items": [
    {
      "menuItem": "60f7b3b3b3b3b3b3b3b3b3b3",
      "quantity": 2,
      "price": 15.99
    },
    {
      "menuItem": "60f7b3b3b3b3b3b3b3b3b3b4",
      "quantity": 1,
      "price": 8.99
    }
  ],
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "specialInstructions": "Extra spicy, no onions"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b3",
    "items": [
      {
        "menuItem": "60f7b3b3b3b3b3b3b3b3b3b3",
        "quantity": 2,
        "price": 15.99
      }
    ],
    "totalAmount": 40.97,
    "status": "pending",
    "paymentStatus": "pending",
    "deliveryAddress": "123 Main St, New York, NY 10001",
    "specialInstructions": "Extra spicy, no onions",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### View Your Orders

#### Get Your Orders
```bash
GET /api/orders/my
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "items": [
        {
          "menuItem": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b3",
            "name": "Chicken Burger",
            "price": 15.99
          },
          "quantity": 2,
          "price": 31.98
        }
      ],
      "totalAmount": 40.97,
      "status": "pending",
      "paymentStatus": "pending",
      "deliveryAddress": "123 Main St, New York, NY 10001",
      "specialInstructions": "Extra spicy, no onions",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Order
```bash
GET /api/orders/60f7b3b3b3b3b3b3b3b3b3b5
Authorization: Bearer <your_token>
```

### Order Status Updates (Staff/Chef/Admin)

#### Update Order Status
```bash
PUT /api/orders/60f7b3b3b3b3b3b3b3b3b3b5/status
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Available Statuses:**
- `pending` - Order received
- `confirmed` - Order confirmed by staff
- `preparing` - Order being prepared
- `ready` - Order ready for pickup/delivery
- `delivered` - Order delivered

---

## 🍽️ Reservation Management

### Make a Reservation

#### Create Reservation
```bash
POST /api/reservations/
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "tableNumber": "T1",
  "reservationDate": "2024-01-15",
  "reservationTime": "19:00",
  "partySize": 4,
  "specialRequests": "Window table preferred"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b3",
    "tableNumber": "T1",
    "reservationDate": "2024-01-15",
    "reservationTime": "19:00",
    "partySize": 4,
    "status": "pending",
    "specialRequests": "Window table preferred",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### View Your Reservations

#### Get Your Reservations
```bash
GET /api/reservations/my
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "tableNumber": "T1",
      "reservationDate": "2024-01-15",
      "reservationTime": "19:00",
      "partySize": 4,
      "status": "confirmed",
      "specialRequests": "Window table preferred",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update Reservation
```bash
PUT /api/reservations/60f7b3b3b3b3b3b3b3b3b3b6
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "partySize": 6,
  "specialRequests": "Updated: Private dining area preferred"
}
```

### Cancel Reservation
```bash
DELETE /api/reservations/60f7b3b3b3b3b3b3b3b3b3b6
Authorization: Bearer <your_token>
```

---

## 💳 Payment Processing

### Create Payment Intent
```bash
POST /api/payments/create-payment-intent
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "amount": 4097,
  "currency": "usd",
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b5"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### Confirm Payment
```bash
POST /api/payments/confirm-payment
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx",
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

---

## 📝 Feedback & Reviews

### Submit Feedback
```bash
POST /api/feedback/
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "order": "60f7b3b3b3b3b3b3b3b3b3b5",
  "rating": 5,
  "comment": "Excellent food and service!",
  "category": "food",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b3",
    "order": "60f7b3b3b3b3b3b3b3b3b3b5",
    "rating": 5,
    "comment": "Excellent food and service!",
    "category": "food",
    "isAnonymous": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Feedback Categories
- `food` - Food quality and taste
- `service` - Staff service quality
- `ambiance` - Restaurant atmosphere
- `delivery` - Delivery service

---

## 👑 Admin Functions

### Menu Management (Admin Only)

#### Create Menu Item
```bash
POST /api/menu/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Pizza",
  "category": "main-course",
  "description": "Delicious margherita pizza",
  "price": 18.99,
  "preparationTime": 25,
  "ingredients": [
    {"name": "Pizza Dough", "quantity": "1 base"},
    {"name": "Mozzarella", "quantity": "100g"},
    {"name": "Tomato Sauce", "quantity": "50ml"}
  ],
  "nutritionalInfo": {
    "calories": 600,
    "protein": 30,
    "carbs": 70,
    "fat": 25
  }
}
```

#### Update Menu Item
```bash
PUT /api/menu/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 19.99,
  "description": "Updated: Premium margherita pizza with fresh basil"
}
```

#### Delete Menu Item
```bash
DELETE /api/menu/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <admin_token>
```

### Inventory Management (Admin Only)

#### Add Inventory Item
```bash
POST /api/inventory/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Chicken Breast",
  "category": "Meat",
  "currentStock": 50,
  "minimumStock": 10,
  "unit": "kg",
  "supplier": "Fresh Foods Ltd",
  "costPerUnit": 8.50,
  "expiryDate": "2024-01-15"
}
```

#### Update Inventory
```bash
PUT /api/inventory/60f7b3b3b3b3b3b3b3b3b3b8
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "currentStock": 45,
  "lastRestocked": "2024-01-02"
}
```

### Reports (Admin Only)

#### Sales Report
```bash
GET /api/reports/sales?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15000.50,
    "totalOrders": 150,
    "averageOrderValue": 100.00,
    "salesByDate": [
      {
        "date": "2024-01-01",
        "sales": 500.00,
        "orders": 5
      }
    ]
  }
}
```

#### Popular Items Report
```bash
GET /api/reports/popular-items
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "menuItem": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Chicken Burger"
      },
      "totalOrders": 50,
      "totalRevenue": 799.50
    }
  ]
}
```

---

## 🔧 Common Use Cases

### Use Case 1: Customer Places Order

1. **Browse Menu**
   ```bash
   GET /api/menu/?category=main-course
   ```

2. **Place Order**
   ```bash
   POST /api/orders/
   {
     "items": [{"menuItem": "id", "quantity": 2, "price": 15.99}],
     "deliveryAddress": "123 Main St"
   }
   ```

3. **Make Payment**
   ```bash
   POST /api/payments/create-payment-intent
   {
     "amount": 3198,
     "orderId": "order_id"
   }
   ```

4. **Submit Feedback**
   ```bash
   POST /api/feedback/
   {
     "order": "order_id",
     "rating": 5,
     "comment": "Great food!"
   }
   ```

### Use Case 2: Staff Manages Orders

1. **View All Orders**
   ```bash
   GET /api/orders/
   ```

2. **Update Order Status**
   ```bash
   PUT /api/orders/order_id/status
   {"status": "confirmed"}
   ```

3. **Check Inventory**
   ```bash
   GET /api/inventory/
   ```

### Use Case 3: Admin Manages System

1. **Create Menu Item**
   ```bash
   POST /api/menu/
   ```

2. **Manage Inventory**
   ```bash
   POST /api/inventory/
   ```

3. **View Reports**
   ```bash
   GET /api/reports/sales
   ```

---

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route - No token provided"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "User role customer is not authorized to access this route. Required roles: admin"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Menu item not found"
}
```

### Error Handling Tips

1. **Check Status Codes**: Always check HTTP status codes
2. **Read Error Messages**: Error messages provide specific details
3. **Validate Input**: Ensure required fields are provided
4. **Check Permissions**: Verify user role and permissions
5. **Handle Network Errors**: Implement retry logic for network issues

---

## 📱 Frontend Integration Examples

### JavaScript/React Example

```javascript
// API Service Class
class RestaurantAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Menu methods
  async getMenuItems(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/menu/?${params}`);
  }

  async createOrder(orderData) {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Reservation methods
  async createReservation(reservationData) {
    return this.request('/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }
}

// Usage
const api = new RestaurantAPI('http://localhost:5000/api', 'your_jwt_token');

// Get menu items
const menuItems = await api.getMenuItems({ category: 'main-course' });

// Create order
const order = await api.createOrder({
  items: [{ menuItem: 'id', quantity: 2, price: 15.99 }],
  deliveryAddress: '123 Main St'
});
```

### Vue.js Example

```javascript
// Vue.js Service
export default {
  data() {
    return {
      apiBaseURL: 'http://localhost:5000/api',
      token: localStorage.getItem('jwt_token')
    }
  },
  methods: {
    async apiRequest(endpoint, options = {}) {
      const response = await fetch(`${this.apiBaseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` })
        },
        ...options
      });
      
      return response.json();
    },

    async getMenuItems() {
      return this.apiRequest('/menu/');
    },

    async placeOrder(orderData) {
      return this.apiRequest('/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    }
  }
}
```

---

## 🔍 Testing Your Integration

### Postman Testing
1. Import the provided Postman collection
2. Set up environment variables
3. Run the collection tests
4. Verify all endpoints work correctly

### Unit Testing
```javascript
// Jest test example
describe('Menu API', () => {
  test('should get menu items', async () => {
    const response = await request(app)
      .get('/api/menu/')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('should create menu item with admin token', async () => {
    const menuData = {
      name: 'Test Item',
      category: 'main-course',
      description: 'Test description',
      price: 10.99,
      preparationTime: 15
    };

    const response = await request(app)
      .post('/api/menu/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(menuData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Item');
  });
});
```

---

## 📞 Support & Help

### Getting Help
1. Check this user guide
2. Review API documentation
3. Check troubleshooting section
4. Contact support team

### Best Practices
1. **Always handle errors** in your application
2. **Validate user input** before sending requests
3. **Store JWT tokens securely** and refresh when needed
4. **Implement proper loading states** for better UX
5. **Test thoroughly** before deploying to production

---

*Last updated: January 2024*
*User Guide Version: 1.0.0*
