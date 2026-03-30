import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    totalRevenue: 0,
    recentBookings: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
        const bookings = response.data;
        
        let revenue = 0;
        let pending = 0;
        let accepted = 0;
        
        bookings.forEach(b => {
          if (b.status === 'pending') pending++;
          if (b.status === 'accepted') {
            accepted++;
            // Calculate revenue from items
            b.items?.forEach(item => {
              revenue += parseFloat(item.price) * item.quantity;
            });
          }
        });

        setStats({
          totalOrders: bookings.length,
          pendingOrders: pending,
          acceptedOrders: accepted,
          totalRevenue: revenue,
          recentBookings: bookings.slice(-5).reverse()
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.totalOrders, icon: <ShoppingBag />, color: '#c5a059' },
    { label: 'Pending', value: stats.pendingOrders, icon: <Clock />, color: '#ffc107' },
    { label: 'Accepted', value: stats.acceptedOrders, icon: <CheckCircle />, color: '#28a745' },
    { label: 'Estimated Revenue', value: `${stats.totalRevenue.toLocaleString()} so'm`, icon: <DollarSign />, color: '#c5a059' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <h1>Dashboard</h1>
        <div style={{ color: 'var(--text-muted)' }}>Welcome back, Admin</div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx} 
            className="glass stat-card"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div style={{ color: stat.color, marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} /> Recent Bookings
        </h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date & Time</th>
                <th>Guest Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user_name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.date} | {booking.time}</td>
                  <td>{booking.people_count}</td>
                  <td>
                    <span className={`badge badge-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
