import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-dark)',
        padding: '1.5rem'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass"
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3rem 2.5rem',
          textAlign: 'center'
        }}
      >
        <div 
          style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', 
            border: '1px solid var(--border-color)' 
          }}
        >
          <Lock size={32} color="var(--accent-gold)" />
        </div>

        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.75rem' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Manage your restaurant effortlessly.</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ 
                  background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', padding: '0.75rem 1rem', 
                  borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', 
                  alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(220, 53, 69, 0.2)' 
                }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin" 
              required 
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader2 size={18} />
              </motion.div>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Premium Restaurant CRM
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
