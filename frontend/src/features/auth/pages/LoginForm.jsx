import React, { useState } from 'react';
import styles from './AuthForm.module.css';

export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Simpan sesi user ke localStorage agar langsung masuk (auto-login)
        localStorage.setItem('user', JSON.stringify(result.data));
        if (result.data.tenantId) {
          localStorage.setItem('tenantId', result.data.tenantId);
        }

        // Panggil fungsi callback pengarah halaman berikutnya
        if (onLoginSuccess) {
          onLoginSuccess(result.data);
        }
      } else {
        setErrorMessage(result.message || 'Email atau kata sandi salah.');
      }
    } catch (error) {
      setErrorMessage('Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Masuk ke Akun</h2>
        <p className={styles.subtitle}>SaaS Kuliner Bali DigiFest 2026</p>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Alamat Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className={styles.input}
            placeholder="nama@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Kata Sandi</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Memproses...' : 'Masuk Sekarang'}
        </button>
      </form>
    </div>
  );
}