# Database Schema Documentation - Restaurant Management System

## 🗄️ Overview

The Restaurant Management System uses MongoDB as the primary database with Mongoose ODM for schema definition and validation. The database is designed to handle all aspects of restaurant operations including user management, menu items, orders, reservations, inventory, payments, and feedback.

---

## 📊 Database Structure

### Collections Overview
- **users** - User accounts and authentication
- **menus** - Menu items and food catalog
- **orders** - Customer orders and transactions
- **reservations** - Table bookings and reservations
- **inventory** - Stock management and ingredients
- **feedback** - Customer reviews and ratings
- **payments** - Payment transactions (if stored locally)

---

## 👥 Users Collection

### Schema Definition
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'staff', 'chef', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    required: function() { return this.role === 'customer'; }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | User's full name |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Hashed password (min 6 chars) |
| `role` | String | Yes | User role (customer/staff/chef/admin) |
| `phone` | String | Conditional | Phone number (required for customers) |
| `address` | Object | No | User's address information |
| `isActive` | Boolean | No | Account status (default: true) |
| `createdAt` | Date | Auto | Account creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Unique index on email
{ email: 1 }

// Compound index for role-based queries
{ role: 1, isActive: 1 }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K",
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
```

---

## 🍽️ Menu Collection

### Schema Definition
```javascript
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['starters', 'main-course', 'desserts', 'drinks', 'sides']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  ingredients: [{
    name: String,
    quantity: String
  }],
  preparationTime: {
    type: Number, // in minutes
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Menu item name |
| `category` | String | Yes | Food category (enum) |
| `description` | String | Yes | Item description |
| `price` | Number | Yes | Price in currency units |
| `image` | String | No | Image filename (default: default-food.jpg) |
| `ingredients` | Array | No | List of ingredients with quantities |
| `preparationTime` | Number | Yes | Prep time in minutes |
| `isAvailable` | Boolean | No | Availability status (default: true) |
| `nutritionalInfo` | Object | No | Nutritional information |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Category index for filtering
{ category: 1 }

// Availability and category compound index
{ isAvailable: 1, category: 1 }

// Text search index
{ name: "text", description: "text" }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Chicken Burger",
  "category": "main-course",
  "description": "Delicious grilled chicken burger with fresh vegetables",
  "price": 15.99,
  "image": "chicken-burger.jpg",
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
```

---

## 🛒 Orders Collection

### Schema Definition
```javascript
const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer` | ObjectId | Yes | Reference to User |
| `items` | Array | Yes | Order items with quantities |
| `totalAmount` | Number | Yes | Total order amount |
| `status` | String | Yes | Order status (enum) |
| `paymentStatus` | String | Yes | Payment status (enum) |
| `deliveryAddress` | String | Yes | Delivery address |
| `specialInstructions` | String | No | Special order instructions |
| `createdAt` | Date | Auto | Order creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Customer orders index
{ customer: 1 }

// Status-based queries
{ status: 1 }

// Payment status index
{ paymentStatus: 1 }

// Compound index for admin queries
{ status: 1, paymentStatus: 1 }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
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
```

---

## 🍽️ Reservations Collection

### Schema Definition
```javascript
const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tableNumber: {
    type: String,
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer` | ObjectId | Yes | Reference to User |
| `tableNumber` | String | Yes | Table identifier |
| `reservationDate` | Date | Yes | Reservation date |
| `reservationTime` | String | Yes | Reservation time |
| `partySize` | Number | Yes | Number of people (min: 1) |
| `status` | String | Yes | Reservation status (enum) |
| `specialRequests` | String | No | Special requests |
| `createdAt` | Date | Auto | Reservation creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Customer reservations
{ customer: 1 }

// Date and time queries
{ reservationDate: 1, reservationTime: 1 }

// Table availability
{ tableNumber: 1, reservationDate: 1, reservationTime: 1 }

// Status queries
{ status: 1 }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "customer": "60f7b3b3b3b3b3b3b3b3b3b4",
  "tableNumber": "T1",
  "reservationDate": "2024-01-15T00:00:00.000Z",
  "reservationTime": "19:00",
  "partySize": 4,
  "status": "confirmed",
  "specialRequests": "Window table preferred",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 📦 Inventory Collection

### Schema Definition
```javascript
const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  category: {
    type: String,
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  supplier: {
    type: String
  },
  costPerUnit: {
    type: Number,
    min: 0
  },
  lastRestocked: {
    type: Date
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Inventory item name |
| `category` | String | Yes | Item category |
| `currentStock` | Number | Yes | Current stock level (min: 0) |
| `minimumStock` | Number | Yes | Minimum stock threshold |
| `unit` | String | Yes | Unit of measurement |
| `supplier` | String | No | Supplier information |
| `costPerUnit` | Number | No | Cost per unit |
| `lastRestocked` | Date | No | Last restock date |
| `expiryDate` | Date | No | Expiry date |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Category-based queries
{ category: 1 }

// Low stock alerts
{ currentStock: 1, minimumStock: 1 }

// Expiry date tracking
{ expiryDate: 1 }

// Supplier queries
{ supplier: 1 }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
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
```

---

## 📝 Feedback Collection

### Schema Definition
```javascript
const feedbackSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  category: {
    type: String,
    enum: ['food', 'service', 'ambiance', 'delivery']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer` | ObjectId | Yes | Reference to User |
| `order` | ObjectId | Yes | Reference to Order |
| `rating` | Number | Yes | Rating 1-5 |
| `comment` | String | No | Feedback comment |
| `category` | String | No | Feedback category (enum) |
| `isAnonymous` | Boolean | No | Anonymous feedback flag |
| `createdAt` | Date | Auto | Feedback creation timestamp |
| `updatedAt` | Date | Auto | Last update timestamp |

### Indexes
```javascript
// Customer feedback
{ customer: 1 }

// Order feedback
{ order: 1 }

// Rating queries
{ rating: 1 }

// Category-based analysis
{ category: 1 }
```

### Sample Document
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "customer": "60f7b3b3b3b3b3b3b3b3b3b4",
  "order": "60f7b3b3b3b3b3b3b3b3b3b5",
  "rating": 5,
  "comment": "Excellent food and service!",
  "category": "food",
  "isAnonymous": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔗 Relationships

### User Relationships
- **One-to-Many** with Orders (customer field)
- **One-to-Many** with Reservations (customer field)
- **One-to-Many** with Feedback (customer field)

### Menu Relationships
- **One-to-Many** with Orders (items.menuItem field)

### Order Relationships
- **Many-to-One** with User (customer field)
- **One-to-Many** with Feedback (order field)
- **Many-to-One** with Menu (items.menuItem field)

### Reservation Relationships
- **Many-to-One** with User (customer field)

### Feedback Relationships
- **Many-to-One** with User (customer field)
- **Many-to-One** with Order (order field)

---

## 📊 Database Queries

### Common Queries

#### Get User Orders
```javascript
Order.find({ customer: userId })
  .populate('items.menuItem', 'name price')
  .sort({ createdAt: -1 });
```

#### Get Menu Items by Category
```javascript
Menu.find({ category: 'main-course', isAvailable: true })
  .sort({ name: 1 });
```

#### Get Low Stock Items
```javascript
Inventory.find({ 
  $expr: { $lt: ['$currentStock', '$minimumStock'] } 
});
```

#### Get Reservations for Date
```javascript
Reservation.find({ 
  reservationDate: { 
    $gte: startOfDay, 
    $lt: endOfDay 
  } 
});
```

#### Get Average Rating
```javascript
Feedback.aggregate([
  { $group: { _id: null, avgRating: { $avg: '$rating' } } }
]);
```

---

## 🔧 Database Operations

### Connection Configuration
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

### Pre-save Hooks
```javascript
// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});
```

### Virtual Fields
```javascript
// Order total calculation
orderSchema.virtual('calculatedTotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});
```

---

## 📈 Performance Optimization

### Indexing Strategy
1. **Primary Keys**: Automatic on `_id` field
2. **Unique Fields**: Email addresses
3. **Query Fields**: Frequently searched fields
4. **Compound Indexes**: Multi-field queries
5. **Text Indexes**: Full-text search

### Query Optimization
1. Use `select()` to limit returned fields
2. Use `populate()` efficiently
3. Implement pagination for large datasets
4. Use aggregation pipelines for complex queries
5. Cache frequently accessed data

### Data Validation
1. Schema-level validation
2. Application-level validation
3. Input sanitization
4. Type checking
5. Range validation

---

## 🔒 Security Considerations

### Data Protection
1. Password hashing with bcrypt
2. Input validation and sanitization
3. SQL injection prevention
4. XSS protection
5. CSRF protection

### Access Control
1. Role-based permissions
2. JWT token validation
3. Route protection
4. Data access restrictions
5. Audit logging

---

## 📋 Maintenance Tasks

### Regular Maintenance
1. **Index Optimization**: Monitor and optimize indexes
2. **Data Cleanup**: Remove old/expired data
3. **Backup**: Regular database backups
4. **Monitoring**: Performance monitoring
5. **Updates**: Keep MongoDB and Mongoose updated

### Data Migration
1. Schema versioning
2. Data transformation scripts
3. Rollback procedures
4. Testing migrations
5. Documentation updates

---

*Last updated: January 2024*
*Database Version: MongoDB 4.4+*
*ODM Version: Mongoose 8.19.2*
