import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CustomerOrder.module.css';

export default function CustomerOrder() {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state untuk pesanan
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Ambil data menu dan keranjang dari localStorage saat halaman dimuat
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('customerCart') || '{}');
    setCart(savedCart);

    const fetchMenus = async () => {
      try {
        const endpoint = tenantId 
          ? `/api/v1/tenants/${tenantId}/menus` 
          : `/api/v1/tenants/menus`;

        const response = await fetch(endpoint);
        const result = await response.json();

        if (response.ok && result.success) {
          setMenus(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat data menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [tenantId]);

  // Petakan keranjang ke data menu yang valid
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const menu = menus.find(m => m._id === id || m.id === Number(id));
      return menu ? { ...menu, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Kirim pesanan ke kasir
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Keranjang belanja masih kosong!");
    if (!tableNumber) return alert("Mohon masukkan nomor meja Anda!");

    setSubmitting(true);

    try {
      const orderData = {
        tenantId: tenantId || null,
        customerName: customerName || 'Tamu Meja ' + tableNumber,
        tableNumber,
        notes,
        items: cartItems.map(item => ({
          menuId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice,
        paymentStatus: 'pending' // Menunggu pembayaran manual di kasir
      };

      // Kirim ke backend (sesuaikan endpoint transaksi Anda)
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem('customerCart');
        navigate(tenantId ? `/menu/success/${tenantId}` : '/menu/success');
      } else {
        alert(result.message || 'Gagal membuat pesanan.');
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'sans-serif' }}>Memuat rincian pesanan...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Konfirmasi Pesanan</h1>
        <p className={styles.subtitle}>Periksa kembali pesanan Anda sebelum dikirim ke kasir.</p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        {/* Informasi Meja & Pelanggan */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>📍 Informasi Meja</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Nomor Meja *</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Meja 05" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Pemesan (Opsional)</label>
            <input 
              type="text" 
              placeholder="Nama Anda" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}>Catatan Tambahan (Opsional)</label>
            <textarea 
              placeholder="Contoh: Jangan pakai es, kurang manis, dll." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Rincian Menu yang Dipesan */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>🛒 Rincian Menu</h3>
          
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item._id || item.id} className={styles.orderItem}>
                <div>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <p className={styles.itemSub}>Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                </div>
                <span className={styles.itemPrice}>
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Belum ada menu dipilih.</p>
          )}

          {cartItems.length > 0 && (
            <div className={styles.summaryTotal}>
              <span>Total Pembayaran</span>
              <span style={{ color: '#d97706' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>

        {/* Catatan Pembayaran Kasir */}
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '0.85rem', borderRadius: '0.75rem', fontSize: '0.85rem', color: '#92400e', marginBottom: '1.25rem' }}>
          💡 <strong>Catatan:</strong> Pembayaran dilakukan secara manual di Kasir. Silakan tunjukkan layar ini atau sebutkan nomor meja Anda setelah pesanan dikirim.
        </div>

        <button 
          type="submit" 
          disabled={submitting || cartItems.length === 0} 
          className={styles.submitBtn}
        >
          {submitting ? 'Mengirim Pesanan...' : 'Kirim Pesanan ke Kasir →'}
        </button>
      </form>
    </div>
  );
}