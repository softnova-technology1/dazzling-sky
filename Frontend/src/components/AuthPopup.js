import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import styles from './AuthPopup.module.css';

export default function AuthPopup({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
      ? 'http://localhost:5000/api/users/login' 
      : 'http://localhost:5000/api/users/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customerData', JSON.stringify(data.user));
        
        // If the user has a cart in the DB, sync it to local storage
        if (data.user.cart && data.user.cart.length > 0) {
            const formattedCart = data.user.cart.map(item => ({
                id: item.product._id || item.product,
                quantity: item.quantity
            }));
            localStorage.setItem('dazzling_sky_cart', JSON.stringify(formattedCart));
            window.dispatchEvent(new Event('cart_updated'));
        }

        if (onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Sign in to access your wishlist and exclusive offers.' 
              : 'Join us to get the best of Dazzling Sky.'}
          </p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <User size={18} className={styles.inputIcon} />
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.inputIcon} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.inputIcon} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleInputChange} 
              required 
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className={styles.switchBtn} 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
