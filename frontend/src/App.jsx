import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Menu from './pages/public/Menu';
import MenuItemDetails from './pages/public/MenuItemDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Refund from './pages/public/Refund';
import ProtectedRoute from './components/common/ProtectedRoute';
import CustomerDashboard from './pages/customer/Dashboard';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import MyOrders from './pages/customer/MyOrders';
import Reservations from './pages/customer/Reservations';
import Feedback from './pages/customer/Feedback';
import Profile from './pages/customer/Profile';
import ChefDashboard from './pages/chef/Dashboard';
import KitchenOrders from './pages/chef/KitchenOrders';
import StaffDashboard from './pages/staff/Dashboard';
import StaffOrders from './pages/staff/Orders';
import StaffReservations from './pages/staff/Reservations';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import MenuManagement from './pages/admin/MenuManagement';
import Inventory from './pages/admin/Inventory';
import AdminOrders from './pages/admin/Orders';
import Payments from './pages/admin/Payments';
import FeedbackModeration from './pages/admin/FeedbackModeration';
import Reports from './pages/admin/Reports';
import OrderTracking from './pages/customer/OrderTracking';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuItemDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Pages */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute roles={['customer']}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute roles={['customer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute roles={['customer']}>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute roles={['customer', 'staff']}>
              <Reservations />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute roles={['customer']}>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={['customer', 'staff', 'chef', 'admin']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/order-tracking" element={
            <ProtectedRoute roles={['customer']}>
              <OrderTracking />
            </ProtectedRoute>
          } />

          {/* Chef Pages */}
          <Route path="/chef/dashboard" element={
            <ProtectedRoute roles={['chef']}>
              <ChefDashboard />
            </ProtectedRoute>
          } />
          <Route path="/chef/orders" element={
            <ProtectedRoute roles={['chef']}>
              <KitchenOrders />
            </ProtectedRoute>
          } />

          {/* Staff Pages */}
          <Route path="/staff/dashboard" element={
            <ProtectedRoute roles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/staff/orders" element={
            <ProtectedRoute roles={['staff']}>
              <StaffOrders />
            </ProtectedRoute>
          } />
          <Route path="/staff/reservations" element={
            <ProtectedRoute roles={['staff']}>
              <StaffReservations />
            </ProtectedRoute>
          } />

          {/* Admin Pages */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/admin/menu" element={
            <ProtectedRoute roles={['admin']}>
              <MenuManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <ProtectedRoute roles={['admin']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute roles={['admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute roles={['admin']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['admin']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/admin/feedback" element={
            <ProtectedRoute roles={['admin']}>
              <FeedbackModeration />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
