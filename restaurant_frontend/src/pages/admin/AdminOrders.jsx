import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Check, 
  X, 
  Eye, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  MoreHorizontal 
} from 'lucide-react';
import axios from 'axios';

const AdminOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings/');
      setBookings(response.data.reverse());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, { status });
      fetchBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === "all" || b.status === filter
  );

  const calculateTotal = (items) => {
    return items?.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) || 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <h1>Orders & Bookings</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'accepted', 'rejected'].map(s => (
            <button 
              key={s} 
              className={`btn ${filter === s ? '' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBooking ? '1fr 400px' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
        <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    style={{ cursor: 'pointer', background: selectedBooking?.id === b.id ? 'rgba(197, 160, 89, 0.05)' : '' }}
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.user_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.phone}</div>
                    </td>
                    <td>
                      <div>{b.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.time}</div>
                    </td>
                    <td>{calculateTotal(b.items).toLocaleString()} so'm</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {b.status === 'pending' && (
                          <>
                            <button className="action-btn" style={{ color: '#28a745' }} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(b.id, 'accepted'); }}><Check size={18} /></button>
                            <button className="action-btn" style={{ color: '#dc3545' }} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(b.id, 'rejected'); }}><X size={18} /></button>
                          </>
                        )}
                        <button className="action-btn"><Eye size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {selectedBooking && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="glass"
              style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3>Order Details</h3>
                <button className="action-btn" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <User size={18} color="var(--accent-gold)" /> <span>{selectedBooking.user_name}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Phone size={18} color="var(--accent-gold)" /> <span>{selectedBooking.phone}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Calendar size={18} color="var(--accent-gold)" /> <span>{selectedBooking.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Clock size={18} color="var(--accent-gold)" /> <span>{selectedBooking.time}</span>
                </div>
              </div>

              <h4 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {selectedBooking.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{item.food_name || "Food Item"} x {item.quantity}</span>
                    <span style={{ color: 'var(--accent-gold)' }}>{(item.price * item.quantity).toLocaleString()} so'm</span>
                  </div>
                ))}
                {(!selectedBooking.items || selectedBooking.items.length === 0) && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking only (no items)</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', marginBottom: '2rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-gold)' }}>{calculateTotal(selectedBooking.items).toLocaleString()} so'm</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {selectedBooking.status === 'pending' && (
                  <>
                    <button className="btn" style={{ flex: 1 }} onClick={() => handleStatusUpdate(selectedBooking.id, 'accepted')}>Accept</button>
                    <button className="btn btn-outline" style={{ flex: 1, color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}>Reject</button>
                  </>
                )}
                {selectedBooking.status !== 'pending' && (
                  <div className={`badge badge-${selectedBooking.status}`} style={{ width: '100%', textAlign: 'center', padding: '0.75rem', fontSize: '1rem' }}>
                    Status: {selectedBooking.status.toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminOrders;
