import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Phone, CheckCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Book = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch: '',
    user_name: '',
    phone: '',
    date: '',
    time: '19:00',
    people_count: 2
  });

  useEffect(() => {
    axios.get('/api/branches/').then(res => {
      setBranches(res.data);
      if (res.data.length > 0) setFormData(prev => ({ ...prev, branch: res.data[0].id }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/bookings/', formData);
      setSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle size={80} color="var(--accent-gold)" style={{ marginBottom: '2rem' }} />
          <h1>{t('success')}</h1>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Tez orada siz bilan bog'lanamiz.</p>
          <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setSuccess(false)}>{t('book_table')}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
        <div style={{ padding: '3rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('reserve_title')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('reserve_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={18} /> Filialni tanlang
            </label>
            <select 
              required
              value={formData.branch}
              onChange={(e) => setFormData({...formData, branch: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--accent-gold) 50%), linear-gradient(135deg, var(--accent-gold) 50%, transparent 50%)',
                backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
                backgroundSize: '5px 5px, 5px 5px',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {branches.length === 0 && <option style={{ background: '#1a1a1a' }}>Filiallar yuklanmoqda...</option>}
              {branches.map(b => (
                <option key={b.id} value={b.id} style={{ background: '#1a1a1a', color: 'white' }}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <User size={18} /> {t('full_name')}
              </label>
              <input 
                required
                type="text" 
                placeholder="John Doe"
                value={formData.user_name}
                onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Phone size={18} /> {t('phone')}
              </label>
              <input 
                required
                type="text" 
                placeholder="+123456789"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calendar size={18} /> {t('date')}
              </label>
              <input 
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={18} /> {t('time')}
              </label>
              <input 
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Users size={18} /> {t('guests')}
              </label>
              <input 
                required
                type="number"
                value={formData.people_count}
                onChange={(e) => setFormData({...formData, people_count: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '2rem' }}
            disabled={loading}
          >
            {loading ? '...' : t('confirm')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Book;
