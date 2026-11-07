import React, { useState, useEffect } from 'react';
import styles from './AuthForm.module.css';

export default function RegisterForm({onRegisterSuccess}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',

    cafeName: '',
    ownerName: '',
    businessType: 'Coffee Shop',
    address: '',

    tenantId: ''
  });

  const [tenantsList, setTenantsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (formData.role === 'cashier') {
      fetchTenants();
    }
  }, [formData.role]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/v1/tenants'); 
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setTenantsList(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat daftar tenant:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('user', JSON.stringify(result.data));
        if (result.data.tenantId) {
          localStorage.setItem('tenantId', result.data.tenantId);
        }
        setMessage({ type: 'success', text: 'Registrasi berhasil! Mengalihkan ke halaman utama...' });
    
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(result.data);
          }
        }, 1000);

        setFormData({
          name: '', email: '', password: '', role: 'customer',
          cafeName: '', ownerName: '', businessType: 'Coffee Shop', address: '', tenantId: ''
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat registrasi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal terhubung ke server backend.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Buat Akun Baru</h2>
        <p className={styles.subtitle}>Bergabung dengan Ekosistem SaaS Kuliner Bali DigiFest 2026</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nama Lengkap / Pengguna</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className={styles.input}
            placeholder="Contoh: Wayan Gede"
          />
        </div>

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

        {/* Pemilihan Peran (Role) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Pilih Peran (Role)</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            className={styles.select}
          >
            <option value="customer">Customer / Pelanggan</option>
            <option value="cashier">Cashier / Staf Kasir</option>
            <option value="tenant_admin">Tenant / Owner (Pemilik Kafe)</option>
          </select>
        </div>

        {formData.role === 'tenant_admin' && (
            <div className={styles.tenantSection}>
                <h4 className={styles.tenantSectionTitle}>🏪 Informasi Detail Kafe / Tenant Anda</h4>
                
                <div className={styles.formGroup}>
                <label className={styles.label}>Nama Kafe / Tenant</label>
                <input 
                    type="text" 
                    name="cafeName" 
                    value={formData.cafeName} 
                    onChange={handleChange} 
                    required 
                    className={styles.input}
                    placeholder="Contoh: Kopi Tuku Sanur"
                />
                </div>

                <div className={styles.formGroup}>
                <label className={styles.label}>Email Bisnis / Tenant</label>
                <input 
                    type="email" 
                    name="tenantEmail" 
                    value={formData.tenantEmail || ''} 
                    onChange={handleChange} 
                    className={styles.input}
                    placeholder="bisnis@kafe.com (Opsional: Kosongkan untuk pakai email pribadi)"
                />
                <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    💡 Jika tidak ada email khusus, dapat menggunakan email pribadi owner di atas.
                </small>
                </div>

                <div className={styles.formGroup}>
                <label className={styles.label}>Nama Pemilik (Owner)</label>
                <input 
                    type="text" 
                    name="ownerName" 
                    value={formData.ownerName} 
                    onChange={handleChange} 
                    className={styles.input}
                    placeholder="Contoh: Wayan Gede"
                />
                </div>

                {/* Dropdown Jenis Usaha Dinamis dari Enum */}
                <div className={styles.formGroup}>
                <label className={styles.label}>Jenis Usaha</label>
                <select 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleChange} 
                    className={styles.select}
                >
                    {['Coffee Shop', 'Warung Tradisional', 'Bakery', 'Restaurant', 'Angkringan', 'Lainnya'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                </div>

                {/* Jika pilih Lainnya, tampilkan input teks kustom */}
                {formData.businessType === 'Lainnya' && (
                <div className={styles.formGroup}>
                    <label className={styles.label}>Sebutkan Jenis Usaha Lainnya</label>
                    <input 
                    type="text" 
                    name="businessTypeCustom" 
                    onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))} 
                    className={styles.input}
                    placeholder="Contoh: Juice Bar / Food Truck"
                    required
                    />
                </div>
                )}

                <div className={styles.formGroup}>
                <label className={styles.label}>Alamat Lengkap Kafe</label>
                <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    required
                    className={styles.input}
                    placeholder="Contoh: Jl. Raya Ubud No. 88, Bali"
                />
                </div>
            </div>
        )}

        {formData.role === 'cashier' && (
          <div className={styles.tenantSection}>
            <h4 className={styles.tenantSectionTitle}>🏢 Pilih Penempatan Tenant / Kafe Kasir</h4>
            <div className={styles.formGroup}>
              <label className={styles.label}>Pilih Kafe Tempat Bertugas</label>
              <select 
                name="tenantId" 
                value={formData.tenantId} 
                onChange={handleChange} 
                required 
                className={styles.select}
              >
                <option value="">-- Pilih Kafe --</option>
                {tenantsList.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.cafeName || tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  );
}