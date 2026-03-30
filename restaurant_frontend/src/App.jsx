import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Settings } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Book from './pages/Book';
import Branches from './pages/Branches';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBranches from './pages/admin/AdminBranches';
import AdminComments from './pages/admin/AdminComments';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes with Navbar */}
            <Route element={<><Navbar /><main><Outlet /></main></>}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/book" element={<Book />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/history" element={<OrderHistory />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes with Protection */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="branches" element={<AdminBranches />} />
              <Route path="comments" element={<AdminComments />} />
            </Route>
          </Routes>
          
          {/* Floating Admin Button */}
          <Link 
            to="/admin" 
            style={{ 
              position: 'fixed', 
              bottom: '2rem', 
              right: '2rem', 
              zIndex: 1000,
              background: 'rgba(28, 28, 28, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-color)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Settings size={24} />
          </Link>

          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(28, 28, 28, 0.9)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--accent-gold)',
                  secondary: 'black',
                },
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
