# 🔧 Admin Feedback Fix - Troubleshooting Guide

## ❌ Error: "Failed to load feedback"

### **Issue:**
After adding the new `/admin` route, admin feedback page shows error.

### **Most Common Cause:**
**Backend server needs to be restarted!** Node.js doesn't auto-reload when you change backend files.

---

## ✅ **SOLUTION - Restart Backend Server:**

### **Option 1: Quick Restart (Recommended)**
```bash
# Stop and restart the whole application
# Press Ctrl+C to stop current npm run dev
# Then run:
npm run dev
```

### **Option 2: Restart Backend Only**
```bash
# In backend terminal:
cd backend
# Press Ctrl+C to stop
npm run dev
```

---

## 🔍 **Verify Fix is Working:**

### **Step 1: Check Backend is Running**
Open browser and go to:
```
http://localhost:5000/api/feedback
```
Should return approved feedback (may be empty array)

### **Step 2: Test Admin Route (with Postman or browser)**
```
GET http://localhost:5000/api/feedback/admin
Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN
```

### **Step 3: Check Frontend Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `/admin/feedback`
4. Look for any red errors

---

## 📋 **Common Errors & Solutions:**

### **Error 1: "Cannot GET /api/feedback/admin"**
**Cause:** Route not registered  
**Fix:** Restart backend server

### **Error 2: "401 Unauthorized"**
**Cause:** Not logged in or token expired  
**Fix:** 
- Logout and login again as admin
- Clear localStorage and re-login

### **Error 3: "403 Forbidden"**
**Cause:** Logged in user is not admin  
**Fix:** Login with admin credentials:
```
Email: superadmin@restaurant.com
Password: admin123
```

### **Error 4: "getAllFeedback is not a function"**
**Cause:** Controller not exported properly  
**Fix:** Check `feedbackController.js` has:
```javascript
exports.getAllFeedback = async (req, res, next) => { ... }
```

### **Error 5: Empty response but no error**
**Cause:** No feedback in database yet  
**Fix:** 
1. Login as customer
2. Place and complete an order
3. Submit feedback
4. Then check admin page

---

## 🧪 **Testing Steps:**

### **Test 1: Create Test Feedback**
```bash
# As customer:
1. Login: customer@restaurant.com / customer123
2. Place order from menu
3. Admin/Staff: Complete the order
4. Customer: Go to /feedback
5. Submit feedback with 5 stars
```

### **Test 2: Verify Admin Can See It**
```bash
# As admin:
1. Login: superadmin@restaurant.com / admin123
2. Go to: /admin/feedback
3. Should see the feedback with "Pending" status
4. Click "Approve"
5. Status changes to "Approved"
```

---

## 📊 **Debug Checklist:**

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Backend was restarted after code changes
- [ ] Logged in as admin (not customer/staff/chef)
- [ ] At least one feedback exists in database
- [ ] Network tab shows request to `/api/feedback/admin`
- [ ] No CORS errors in console

---

## 🛠️ **Manual Database Check:**

If you have MongoDB access:
```javascript
// Connect to MongoDB
use restaurant_db

// Check if feedback exists
db.feedbacks.find().pretty()

// Check feedback count
db.feedbacks.count()

// Create test feedback manually (if needed)
db.feedbacks.insertOne({
  customer: ObjectId("YOUR_CUSTOMER_ID"),
  order: ObjectId("YOUR_ORDER_ID"),
  rating: 5,
  comment: "Test feedback",
  isApproved: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔄 **Full Clean Restart:**

If nothing works, try complete restart:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear node_modules cache (optional)
cd backend
rm -rf node_modules
npm install

cd ../frontend  
rm -rf node_modules
npm install

# 3. Restart from root
cd ..
npm run dev
```

---

## 📞 **Still Not Working?**

Check these files have correct code:

### **File 1: backend/controllers/feedbackController.js**
Should have around line 101:
```javascript
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const feedback = await Feedback.find({})
    // ... rest of code
```

### **File 2: backend/routes/feedback.js**
Should have around line 17:
```javascript
router.get('/admin', protect, authorize('admin'), getAllFeedback);
```

### **File 3: frontend/src/pages/admin/FeedbackModeration.jsx**
Should have around line 15:
```javascript
const res = await api.get('/feedback/admin');
```

---

## ✅ **Expected Result:**

After restart, admin feedback page should:
- ✅ Load without errors
- ✅ Show all feedback (approved + pending)
- ✅ Display yellow badges for pending
- ✅ Display green badges for approved
- ✅ Have working Approve/Delete buttons

---

**Quick Fix:** Just restart the backend server! 🚀

