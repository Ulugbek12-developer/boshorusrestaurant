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

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/bookings/');
      const bookings = response.data;
      
      let revenue = 0;
      let pending = 0;
      let accepted = 0;
      
      bookings.forEach(b => {
        if (b.status === 'pending') pending++;
        if (b.status === 'accepted') {
          accepted++;
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
        recentBookings: [...bookings].reverse().slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`/api/bookings/${id}/`, { status });
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalOrders.toLocaleString(), icon: <ShoppingBag />, color: '#c5a059' },
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
                <th style={{ textAlign: 'right' }}>Actions</th>
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
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn" 
                            style={{ color: '#28a745', background: 'rgba(40, 167, 69, 0.1)', border: 'none', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }} 
                            onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            className="action-btn" 
                            style={{ color: '#dc3545', background: 'rgba(220, 53, 69, 0.1)', border: 'none', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }} 
                            onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
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
