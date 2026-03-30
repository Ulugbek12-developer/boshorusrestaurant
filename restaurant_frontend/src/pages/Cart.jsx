import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalSum, clearCart, addOrderToHistory } = useCart();
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
    axios.get('http://127.0.0.1:8000/api/branches/').then(res => {
      setBranches(res.data);
      if (res.data.length > 0) setFormData(prev => ({ ...prev, branch: res.data[0].id }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: cartItems.map(item => ({
          food: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      const response = await axios.post('http://127.0.0.1:8000/api/bookings/', payload);
      
      // Save to local history
      addOrderToHistory({
        id: response.data.id,
        date: formData.date,
        items: [...cartItems],
        total: totalSum
      });

      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Booking error:", error);
      const msg = error.response?.data?.detail || "Ma'lumotlar bazasida bu ovqatlar topilmadi. Iltimos, savatchani tozalab, menyudan qaytadan ovqat qo'shing.";
      alert(msg);
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
          <button className="btn" style={{ marginTop: '2rem' }} onClick={() => window.location.href = '/'}>Bosh sahifa</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1>{t('menu')} / {t('home')}</h1>
      
      <div className="grid grid-cols-3" style={{ gap: '2rem', marginTop: '2rem' }}>
        {/* Left Side: Items */}
        <div className="col-span-2">
          {cartItems.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
               <p>Savatchangiz bo'sh. Menyudan ovqat tanlang.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={clearCart} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>Hammasini o'chirish</button>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="glass" style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                    <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{new Intl.NumberFormat('uz-UZ').format(item.price)} {t('currency')}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '25px', padding: '0.2rem 0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                    <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'rgba(255,0,0,0.6)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Order Summary & Form */}
        <div>
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('confirm')}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem' }}>
              <span>Jami:</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{new Intl.NumberFormat('uz-UZ').format(totalSum)} {t('currency')}</span>
            </div>
            
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>Filialni tanlang:</label>
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

                <input required type="text" placeholder={t('full_name')} value={formData.user_name} onChange={e => setFormData({...formData, user_name: e.target.value})} />
                <input required type="text" placeholder={t('phone')} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                <input required type="number" placeholder={t('guests')} value={formData.people_count} onChange={e => setFormData({...formData, people_count: parseInt(e.target.value)})} />
                
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={loading || cartItems.length === 0}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {loading ? 'Yuborilmoqda...' : t('confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
