import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Tags, 
  ShoppingBag, 
  MapPin, 
  MessageSquare,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Orders/Bookings', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Branches', path: '/admin/branches', icon: <MapPin size={20} /> },
    { name: 'Comments', path: '/admin/comments', icon: <MessageSquare size={20} /> },
  ];

  return (
    <aside className="admin-sidebar" style={{ position: 'sticky', top: 0, height: '100vh' }}>
      <div className="admin-logo">
        <UtensilsCrossed size={32} color="var(--accent-gold)" />
        <span className="admin-nav-text">Admin Panel</span>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => 
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="admin-nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
        <button 
          className="admin-nav-item" 
          style={{ width: '100%', background: 'none', border: 'none' }}
          onClick={logout}
        >
          <LogOut size={20} />
          <span className="admin-nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
