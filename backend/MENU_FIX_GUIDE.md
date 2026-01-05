# Restaurant Management System - Menu Creation Fix

## Issues Found and Fixed:

### 1. **Route Configuration Problem** ✅ FIXED
- **Issue**: Conflicting POST routes in `routes/menu.js`
- **Fix**: Cleaned up route definitions, removed duplicate routes
- **Result**: Now only admin users can create menu items

### 2. **Missing Environment Variables** ⚠️ NEEDS SETUP
- **Issue**: No `.env` file found
- **Fix**: You need to create a `.env` file with required variables

### 3. **Authentication System** ✅ WORKING
- **Issue**: Authentication middleware was commented out
- **Fix**: Restored proper authentication for admin-only menu creation

## Setup Instructions:

### Step 1: Create Environment File
Create a `.env` file in the root directory with:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant_db
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Admin User
```bash
npm run create-admin
```

### Step 4: Test Menu Creation
```bash
npm run test-menu
```

### Step 5: Start Server
```bash
npm start
```

### Step 6: Test API Endpoints
```bash
npm run test-api
```

## How to Create Menu Items (Admin Only):

### 1. Login as Admin
```bash
POST /api/auth/login
{
  "email": "superadmin@restaurant.com",
  "password": "admin123"
}
```

### 2. Create Menu Item
```bash
POST /api/menu/
Authorization: Bearer <your_jwt_token>
{
  "name": "Chicken Burger",
  "category": "main-course",
  "description": "Delicious chicken burger",
  "price": 15.99,
  "preparationTime": 20,
  "ingredients": [
    {"name": "Chicken Patty", "quantity": "1 piece"},
    {"name": "Lettuce", "quantity": "2 leaves"}
  ]
}
```

## Valid Categories:
- `starters`
- `main-course`
- `desserts`
- `drinks`
- `sides`

## Required Fields:
- `name` (string)
- `category` (enum)
- `description` (string)
- `price` (number, min: 0)
- `preparationTime` (number, min: 1)

## Optional Fields:
- `image` (string, default: 'default-food.jpg')
- `ingredients` (array of objects)
- `nutritionalInfo` (object)
- `isAvailable` (boolean, default: true)

## Admin Credentials:
- **Email**: superadmin@restaurant.com
- **Password**: admin123
- **Role**: admin

## Troubleshooting:

### If menu creation fails:
1. Check if MongoDB is running
2. Verify `.env` file exists with correct JWT_SECRET
3. Ensure admin user exists (run `npm run create-admin`)
4. Check server logs for error messages
5. Verify JWT token is valid and not expired

### Common Errors:
- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: User is not admin
- **400 Bad Request**: Validation errors (check required fields)
- **500 Server Error**: Database connection or server issues

## Files Modified:
- ✅ `routes/menu.js` - Fixed route configuration
- ✅ `package.json` - Added axios dependency and test scripts
- ✅ `testMenuCreation.js` - Created test script
- ✅ `testMenuAPI.js` - Created API test script

The menu creation system is now properly configured for admin-only access with proper validation!
