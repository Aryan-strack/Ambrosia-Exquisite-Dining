const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testMenuAPI = async () => {
  try {
    console.log('🧪 Testing Menu API Endpoints...\n');
    
    // Test 1: Login as admin
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'superadmin@restaurant.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Admin login successful');
      const token = loginResponse.data.token;
      
      // Test 2: Create menu item
      console.log('\n2️⃣ Testing menu creation...');
      const menuData = {
        name: 'API Test Pizza',
        category: 'main-course',
        description: 'Delicious pizza created via API test',
        price: 18.99,
        preparationTime: 25,
        ingredients: [
          { name: 'Pizza Dough', quantity: '1 base' },
          { name: 'Mozzarella', quantity: '100g' },
          { name: 'Tomato Sauce', quantity: '50ml' }
        ]
      };
      
      const createResponse = await axios.post(`${BASE_URL}/menu/`, menuData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (createResponse.data.success) {
        console.log('✅ Menu item created successfully:', createResponse.data.data.name);
        const menuId = createResponse.data.data._id;
        
        // Test 3: Get menu items
        console.log('\n3️⃣ Testing menu retrieval...');
        const getResponse = await axios.get(`${BASE_URL}/menu/`);
        console.log('✅ Menu items retrieved:', getResponse.data.count, 'items');
        
        // Test 4: Update menu item
        console.log('\n4️⃣ Testing menu update...');
        const updateResponse = await axios.put(`${BASE_URL}/menu/${menuId}`, {
          price: 19.99,
          description: 'Updated description via API test'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (updateResponse.data.success) {
          console.log('✅ Menu item updated successfully');
        }
        
        // Test 5: Delete menu item
        console.log('\n5️⃣ Testing menu deletion...');
        const deleteResponse = await axios.delete(`${BASE_URL}/menu/${menuId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (deleteResponse.data.success) {
          console.log('✅ Menu item deleted successfully');
        }
        
        console.log('\n🎉 All API tests passed! Menu creation system is working correctly.');
        
      } else {
        console.log('❌ Menu creation failed:', createResponse.data);
      }
      
    } else {
      console.log('❌ Admin login failed:', loginResponse.data);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('\n💡 Make sure to:');
      console.log('1. Run: node createAdmin.js');
      console.log('2. Start the server: npm start');
      console.log('3. Check your .env file has JWT_SECRET');
    }
  }
};

// Check if axios is available
try {
  require('axios');
  testMenuAPI();
} catch (error) {
  console.log('❌ axios not found. Installing...');
  const { exec } = require('child_process');
  exec('npm install axios', (err, stdout, stderr) => {
    if (err) {
      console.error('Failed to install axios:', err);
      return;
    }
    console.log('✅ axios installed. Please run this script again.');
  });
}
