import React, { useState, useEffect } from 'react';
import styles from './MarketBasketInsights.module.css';

/**
 * Komponen Terpisah: AI Smart Bundling & Market Basket Insights
 * Menampilkan rekomendasi kombo menu berdasarkan analisis pola transaksi anonim dengan info Tenant.
 */
export default function MarketBasketInsights({ tenantId }) {
  const [mbaInsights, setMbaInsights] = useState([]);
  const [tenantName, setTenantName] = useState("Kafe / Tenant Lokal");
  const [loading, setLoading] = useState(true);

  // Fallback Tenant ID jika prop tenantId belum tersedia
  const activeTenantId = tenantId || localStorage.getItem('tenantId') || "6aec060fbb71bd1b0a3ef9ae";

  useEffect(() => {
    if (activeTenantId) {
      fetchTenantAndInsights(activeTenantId);
    }
  }, [activeTenantId]);

  const fetchTenantAndInsights = async (tId) => {
    try {
      setLoading(true);

      // 1. Ambil data wawasan Market Basket
      const mbaResponse = await fetch(`/api/v1/insights/market-basket/${tId}`);
      const mbaResult = await mbaResponse.json();
      if (mbaResult.success) {
        setMbaInsights(mbaResult.data);
      }

      // 2. Ambil data profil tenant (opsional, jika rute tenant tersedia)
      const tenantResponse = await fetch(`/api/v1/tenants/${tId}`);
      const tenantResult = await tenantResponse.json();
        if (tenantResult) {
            const resolvedName = 
                tenantResult.name || 
                tenantResult.cafeName || 
                tenantResult.cafe_name || 
                tenantResult.data?.name || 
                tenantResult.data?.cafeName;
                    
            if (resolvedName) {
                setTenantName(resolvedName);
            }
        }
    } catch (error) {
      console.error("Gagal memuat data wawasan atau tenant:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Memuat Wawasan Pola Belanja Pelanggan...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#d97706', backgroundColor: '#fef3c7', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', border: '1px solid #fde68a' }}>
            Tenant: {tenantName}
          </span>
        </div>
        <h2 className={styles.sectionTitle}>
          <span>▪</span> AI Smart Bundling & Cross-Selling Insights
        </h2>
        <p className={styles.sectionSubtitle}>
          Rekomendasi paket kombo cerdas otomatis dari pola transaksi historis kafe ini.
        </p>
      </div>

      {mbaInsights.length > 0 ? (
        <div className={styles.cardsGrid}>
          {mbaInsights.map((item, index) => (
            <div key={index} className={styles.card}>
              <div>
                <span className={styles.confidenceTag}>
                  Akurasi Keyakinan: {(item.confidence * 100).toFixed(0)}%
                </span>
                <p className={styles.buyLabel}>Jika pelanggan memesan:</p>
                <h3 className={styles.antecedentText}>
                  🍲 {item.ifUserBuys.map(i => i.menuName).join(', ')}
                </h3>
              </div>

              <div className={styles.cardFooter}>
                <p className={styles.recommendLabel}>Rekomendasi Penawaran Silang:</p>
                <p className={styles.consequentText}>
                  ✨ {item.thenRecommend.map(i => i.menuName).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          Belum ada data pola asosiasi Market Basket untuk tenant ini. Jalankan skrip Python analisis terlebih dahulu.
        </div>
      )}
    </div>
  );
}