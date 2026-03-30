import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle } from 'lucide-react';

const OrderHistory = () => {
  const { orderHistory } = useCart();
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Mening buyurtmalarim</h1>
      
      {orderHistory.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Hali buyurtmalar mavjud emas.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orderHistory.map((order, idx) => (
            <div key={idx} className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} color="var(--accent-gold)" />
                  <span style={{ fontWeight: 'bold' }}>Sana: {order.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4CAF50' }}>
                   <CheckCircle size={20} />
                   <span>Qabul qilindi</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)} {t('currency')}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>Jami summa:</span>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {new Intl.NumberFormat('uz-UZ').format(order.total)} {t('currency')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
