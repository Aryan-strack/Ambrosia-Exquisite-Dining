# Postman Testing Guide - Menu Creation

## Step 1: Setup Environment Variables in Postman

### Create New Environment:
1. Open Postman
2. Click on "Environments" tab
3. Click "Create Environment"
4. Name: `Restaurant API`
5. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` |
| `admin_email` | `superadmin@restaurant.com` | `superadmin@restaurant.com` |
| `admin_password` | `admin123` | `admin123` |
| `jwt_token` | (leave empty) | (leave empty) |

6. Click "Save"

## Step 2: Admin Login Request

### Request Details:
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/login`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "{{admin_email}}",
    "password": "{{admin_password}}"
  }
  ```

### Test Script (add in Tests tab):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.token) {
        pm.environment.set("jwt_token", response.token);
        console.log("✅ Login successful, token saved");
    }
}
```

## Step 3: Create Menu Item Request

### Request Details:
- **Method**: `POST`
- **URL**: `{{base_url}}/menu/`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer {{jwt_token}}
  ```
- **Body** (raw JSON):
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
      },
      {
        "name": "Onion",
        "quantity": "1 slice"
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

### Test Script (add in Tests tab):
```javascript
pm.test("Menu item created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('name');
    pm.environment.set("menu_id", response.data._id);
    console.log("✅ Menu item created:", response.data.name);
});
```

## Step 4: Get All Menu Items

### Request Details:
- **Method**: `GET`
- **URL**: `{{base_url}}/menu/`

### Test Script:
```javascript
pm.test("Menu items retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.be.an('array');
    console.log("✅ Retrieved", response.count, "menu items");
});
```

## Step 5: Get Single Menu Item

### Request Details:
- **Method**: `GET`
- **URL**: `{{base_url}}/menu/{{menu_id}}`

### Test Script:
```javascript
pm.test("Single menu item retrieved", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('name');
    console.log("✅ Retrieved menu item:", response.data.name);
});
```

## Step 6: Update Menu Item

### Request Details:
- **Method**: `PUT`
- **URL**: `{{base_url}}/menu/{{menu_id}}`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer {{jwt_token}}
  ```
- **Body** (raw JSON):
  ```json
  {
    "price": 17.99,
    "description": "Updated: Premium grilled chicken burger with fresh vegetables and special sauce"
  }
  ```

### Test Script:
```javascript
pm.test("Menu item updated successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.price).to.eql(17.99);
    console.log("✅ Menu item updated successfully");
});
```

## Step 7: Delete Menu Item

### Request Details:
- **Method**: `DELETE`
- **URL**: `{{base_url}}/menu/{{menu_id}}`
- **Headers**:
  ```
  Authorization: Bearer {{jwt_token}}
  ```

### Test Script:
```javascript
pm.test("Menu item deleted successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    console.log("✅ Menu item deleted successfully");
});
```

## Step 8: Get Menu Categories

### Request Details:
- **Method**: `GET`
- **URL**: `{{base_url}}/menu/categories`

### Test Script:
```javascript
pm.test("Categories retrieved successfully", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.be.an('array');
    console.log("✅ Available categories:", response.data);
});
```

## Sample Menu Items for Testing:

### 1. Starter
```json
{
  "name": "Chicken Wings",
  "category": "starters",
  "description": "Crispy chicken wings with spicy buffalo sauce",
  "price": 8.99,
  "preparationTime": 15
}
```

### 2. Main Course
```json
{
  "name": "Grilled Salmon",
  "category": "main-course",
  "description": "Fresh Atlantic salmon grilled to perfection",
  "price": 22.99,
  "preparationTime": 25
}
```

### 3. Dessert
```json
{
  "name": "Chocolate Cake",
  "category": "desserts",
  "description": "Rich chocolate cake with vanilla ice cream",
  "price": 6.99,
  "preparationTime": 10
}
```

### 4. Drink
```json
{
  "name": "Fresh Orange Juice",
  "category": "drinks",
  "description": "Freshly squeezed orange juice",
  "price": 3.99,
  "preparationTime": 5
}
```

### 5. Side
```json
{
  "name": "French Fries",
  "category": "sides",
  "description": "Crispy golden french fries",
  "price": 4.99,
  "preparationTime": 12
}
```

## Error Testing:

### Test Invalid Category:
```json
{
  "name": "Test Item",
  "category": "invalid-category",
  "description": "Test description",
  "price": 10.99,
  "preparationTime": 15
}
```
**Expected**: 400 Bad Request with validation error

### Test Missing Required Field:
```json
{
  "name": "Test Item",
  "category": "main-course",
  "price": 10.99,
  "preparationTime": 15
}
```
**Expected**: 400 Bad Request (missing description)

### Test Without Authentication:
Remove Authorization header and try to create menu item.
**Expected**: 401 Unauthorized

## Collection Setup:

1. Create a new Collection named "Restaurant Management API"
2. Add all the above requests to the collection
3. Set the collection to use the "Restaurant API" environment
4. Run the collection in sequence to test the complete flow

## Pre-request Scripts:

Add this to the collection's pre-request script to ensure server is running:
```javascript
pm.test("Server is running", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 400, 401, 403, 404]);
});
```

## Troubleshooting:

### Common Issues:
1. **401 Unauthorized**: Check if JWT token is valid and not expired
2. **403 Forbidden**: Ensure user has admin role
3. **400 Bad Request**: Check required fields and validation rules
4. **500 Server Error**: Check if MongoDB is running and server is started

### Debug Tips:
1. Check Postman Console for detailed error messages
2. Verify environment variables are set correctly
3. Ensure server is running on correct port (5000)
4. Check MongoDB connection

## Quick Test Sequence:
1. Login → Get Token
2. Create Menu Item → Get Menu ID
3. Get All Menu Items
4. Get Single Menu Item
5. Update Menu Item
6. Delete Menu Item
7. Get Categories

यह complete Postman testing guide है! सभी requests को step-by-step follow करें। 🚀
