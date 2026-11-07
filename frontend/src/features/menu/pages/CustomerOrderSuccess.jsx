import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function CustomerOrderSuccess() {
  const { tenantId } = useParams();

  return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
      <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Pesanan Berhasil Dikirim!</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
        Pesanan Anda telah diteruskan ke bagian kasir kafe. Silakan lakukan pembayaran langsung di kasir dengan menyebutkan nomor meja Anda.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link 
          to={tenantId ? `/menu/${tenantId}` : '/menu'} 
          style={{ 
            background: '#f59e0b', 
            color: '#fff', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)' 
          }}
        >
          ← Kembali ke Menu Kafe
        </Link>
      </div>
    </div>
  );
}