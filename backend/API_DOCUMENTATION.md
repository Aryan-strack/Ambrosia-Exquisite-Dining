# API Documentation - Restaurant Management System

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
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

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isActive": true
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
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

### POST /auth/logout
Logout current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🍽️ Menu Endpoints

### GET /menu/
Get all menu items with optional filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category (`starters`, `main-course`, `desserts`, `drinks`, `sides`)
- `available` (optional): Filter by availability (`true` or `false`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET /menu/?category=main-course&available=true&page=1&limit=5
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "pagination": {
    "page": 1,
    "pages": 5
  },
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Chicken Burger",
      "category": "main-course",
      "description": "Delicious grilled chicken burger",
      "price": 15.99,
      "image": "default-food.jpg",
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
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /menu/categories
Get all available menu categories.

**Response (200):**
```json
{
  "success": true,
  "data": ["starters", "main-course", "desserts", "drinks", "sides"]
}
```

### GET /menu/:id
Get a single menu item by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Burger",
    "category": "main-course",
    "description": "Delicious grilled chicken burger",
    "price": 15.99,
    "image": "default-food.jpg",
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /menu/
Create a new menu item (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Chicken Burger",
  "category": "main-course",
  "description": "Delicious grilled chicken burger with fresh vegetables",
  "price": 15.99,
  "preparationTime": 20,
  "ingredients": [
    {
      "name": "Chicken Patty",
      "quantity": "1 piece"
    },
    {
      "name": "Lettuce",
      "quantity": "2 leaves"
    },
    {
      "name": "Tomato",
      "quantity": "2 slices"
    }
  ],
  "nutritionalInfo": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 20
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Burger",
    "category": "main-course",
    "description": "Delicious grilled chicken burger with fresh vegetables",
    "price": 15.99,
    "image": "default-food.jpg",
    "ingredients": [
      {"name": "Chicken Patty", "quantity": "1 piece"},
      {"name": "Lettuce", "quantity": "2 leaves"},
      {"name": "Tomato", "quantity": "2 slices"}
    ],
    "preparationTime": 20,
    "isAvailable": true,
    "nutritionalInfo": {
      "calories": 450,
      "protein": 25,
      "carbs": 35,
      "fat": 20
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /menu/:id
Update a menu item (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "price": 17.99,
  "description": "Updated: Premium grilled chicken burger with special sauce"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Burger",
    "category": "main-course",
    "description": "Updated: Premium grilled chicken burger with special sauce",
    "price": 17.99,
    "image": "default-food.jpg",
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### DELETE /menu/:id
Delete a menu item (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## 🛒 Order Endpoints

### GET /orders/
Get all orders (Admin/Staff only).

**Headers:**
```
Authorization: Bearer <admin_or_staff_token>
```

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "customer": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "menuItem": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b5",
            "name": "Chicken Burger",
            "price": 15.99
          },
          "quantity": 2,
          "price": 31.98
        }
      ],
      "totalAmount": 31.98,
      "status": "pending",
      "paymentStatus": "pending",
      "deliveryAddress": "123 Main St, New York",
      "specialInstructions": "Extra spicy",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /orders/my
Get current user's orders.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "items": [
        {
          "menuItem": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b5",
            "name": "Chicken Burger",
            "price": 15.99
          },
          "quantity": 2,
          "price": 31.98
        }
      ],
      "totalAmount": 31.98,
      "status": "pending",
      "paymentStatus": "pending",
      "deliveryAddress": "123 Main St, New York",
      "specialInstructions": "Extra spicy",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /orders/:id
Get a single order by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "customer": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "menuItem": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b5",
          "name": "Chicken Burger",
          "price": 15.99
        },
        "quantity": 2,
        "price": 31.98
      }
    ],
    "totalAmount": 31.98,
    "status": "pending",
    "paymentStatus": "pending",
    "deliveryAddress": "123 Main St, New York",
    "specialInstructions": "Extra spicy",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /orders/
Create a new order.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "menuItem": "60f7b3b3b3b3b3b3b3b3b3b5",
      "quantity": 2,
      "price": 15.99
    }
  ],
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "specialInstructions": "Extra spicy, no onions"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b4",
    "items": [
      {
        "menuItem": "60f7b3b3b3b3b3b3b3b3b3b5",
        "quantity": 2,
        "price": 15.99
      }
    ],
    "totalAmount": 31.98,
    "status": "pending",
    "paymentStatus": "pending",
    "deliveryAddress": "123 Main St, New York, NY 10001",
    "specialInstructions": "Extra spicy, no onions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /orders/:id/status
Update order status (Admin/Staff only).

**Headers:**
```
Authorization: Bearer <admin_or_staff_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "status": "confirmed",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 🍽️ Reservation Endpoints

### GET /reservations/
Get all reservations (Admin/Staff only).

**Headers:**
```
Authorization: Bearer <admin_or_staff_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "customer": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tableNumber": "T1",
      "reservationDate": "2024-01-15",
      "reservationTime": "19:00",
      "partySize": 4,
      "status": "confirmed",
      "specialRequests": "Window table preferred",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /reservations/my
Get current user's reservations.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "tableNumber": "T1",
      "reservationDate": "2024-01-15",
      "reservationTime": "19:00",
      "partySize": 4,
      "status": "confirmed",
      "specialRequests": "Window table preferred",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /reservations/
Create a new reservation.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tableNumber": "T1",
  "reservationDate": "2024-01-15",
  "reservationTime": "19:00",
  "partySize": 4,
  "specialRequests": "Window table preferred"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b4",
    "tableNumber": "T1",
    "reservationDate": "2024-01-15",
    "reservationTime": "19:00",
    "partySize": 4,
    "status": "pending",
    "specialRequests": "Window table preferred",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /reservations/:id
Update a reservation.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "partySize": 6,
  "specialRequests": "Updated: Private dining area preferred"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "tableNumber": "T1",
    "reservationDate": "2024-01-15",
    "reservationTime": "19:00",
    "partySize": 6,
    "status": "confirmed",
    "specialRequests": "Updated: Private dining area preferred",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### DELETE /reservations/:id
Cancel a reservation.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully"
}
```

---

## 📦 Inventory Endpoints

### GET /inventory/
Get all inventory items (Admin/Staff only).

**Headers:**
```
Authorization: Bearer <admin_or_staff_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Chicken Breast",
      "category": "Meat",
      "currentStock": 50,
      "minimumStock": 10,
      "unit": "kg",
      "supplier": "Fresh Foods Ltd",
      "costPerUnit": 8.50,
      "lastRestocked": "2024-01-01T00:00:00.000Z",
      "expiryDate": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /inventory/
Add new inventory item (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
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

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Chicken Breast",
    "category": "Meat",
    "currentStock": 50,
    "minimumStock": 10,
    "unit": "kg",
    "supplier": "Fresh Foods Ltd",
    "costPerUnit": 8.50,
    "lastRestocked": "2024-01-01T00:00:00.000Z",
    "expiryDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💳 Payment Endpoints

### POST /payments/create-payment-intent
Create Stripe payment intent.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1599,
  "currency": "usd",
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
}
```

### POST /payments/confirm-payment
Confirm payment.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "orderId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

---

## 📝 Feedback Endpoints

### GET /feedback/
Get all feedback (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "customer": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "order": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "totalAmount": 31.98
      },
      "rating": 5,
      "comment": "Excellent food and service!",
      "category": "food",
      "isAnonymous": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /feedback/
Submit feedback.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order": "60f7b3b3b3b3b3b3b3b3b3b3",
  "rating": 5,
  "comment": "Excellent food and service!",
  "category": "food",
  "isAnonymous": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "customer": "60f7b3b3b3b3b3b3b3b3b3b4",
    "order": "60f7b3b3b3b3b3b3b3b3b3b3",
    "rating": 5,
    "comment": "Excellent food and service!",
    "category": "food",
    "isAnonymous": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 Report Endpoints

### GET /reports/sales
Get sales report (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response (200):**
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

### GET /reports/popular-items
Get popular items report (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
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

## ❌ Error Responses

### 400 Bad Request
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

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route - No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role customer is not authorized to access this route. Required roles: admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Menu item not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## 🔧 Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Menu endpoints**: 100 requests per minute per user
- **Order endpoints**: 20 requests per minute per user
- **Payment endpoints**: 10 requests per minute per user

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All monetary values are in cents (e.g., $15.99 = 1599)
3. JWT tokens expire after 30 days by default
4. Pagination is available for list endpoints
5. All protected endpoints require valid JWT token
6. Admin-only endpoints require admin role
7. Staff endpoints require staff or admin role
8. Customer endpoints require customer role or higher

---

*Last updated: January 2024*
*API Version: 1.0.0*
