import React, { useState, useEffect } from 'react';
import styles from './CashierDashboard.module.css';

export default function CashierDashboard({ tenantId, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data pesanan dari backend berdasarkan tenantId aktif
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const activeTenantId = tenantId || user?.tenantId;
      
      if (!activeTenantId) return;

      const response = await fetch(`/api/v1/orders/${activeTenantId}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat pesanan kasir:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Opsional: Polling otomatis setiap 10 detik agar kasir melihat pesanan baru tanpa refresh
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [tenantId, user]);

  // Fungsi mengubah status pesanan menjadi 'paid' (sudah dibayar)
  const handleMarkAsPaid = async (orderId) => {
    if (!window.confirm("Konfirmasi pembayaran tunai/manual untuk pesanan ini?")) return;

    try {
      const response = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'paid' })
      });

      const result = await response.json();
      if (response.ok) {
        // Perbarui state lokal secara instan
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, paymentStatus: 'paid' } : order
        ));
      } else {
        alert(result.message || 'Gagal memperbarui status pesanan.');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Kasir */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🖥️ Panel Kasir (POS) - Live Orders</h1>
          <p className={styles.subtitle}>Pantau pesanan mandiri dari meja pelanggan & verifikasi pembayaran.</p>
        </div>
        <button onClick={fetchOrders} className={styles.refreshBtn}>
          🔄 Muat Ulang
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>Memuat daftar pesanan masuk...</p>
      ) : (
        <div className={styles.grid}>
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order._id} className={`${styles.orderCard} ${styles[order.paymentStatus]}`}>
                <div>
                  <div className={styles.cardHeader}>
                    <span className={styles.tableBadge}>📍 {order.tableNumber}</span>
                    <span className={`${styles.statusBadge} ${styles[order.paymentStatus]}`}>
                      {order.paymentStatus === 'pending' ? '⏳ Menunggu Bayar' : '✅ Sudah Dibayar'}
                    </span>
                  </div>

                  <h3 className={styles.customerName}>{order.customerName}</h3>
                  <p className={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>

                  {/* Daftar Item Pesanan */}
                  <ul className={styles.itemList}>
                    {order.items.map((item, idx) => (
                      <li key={idx} className={styles.itemRow}>
                        <span>{item.quantity}x {item.name}</span>
                        <span style={{ fontWeight: 600 }}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className={styles.notesBox}>
                      💬 <strong>Catatan:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Footer Kartu & Aksi Kasir */}
                <div className={styles.cardFooter}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Total Tagihan</span>
                    <span className={styles.totalPrice}>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                  </div>

                  {order.paymentStatus === 'pending' ? (
                    <button 
                      onClick={() => handleMarkAsPaid(order._id)}
                      className={styles.payBtn}
                    >
                      Terima Bayar ✓
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 'bold' }}>
                      Selesai
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Belum ada pesanan masuk saat ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}