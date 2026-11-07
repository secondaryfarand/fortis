import React, { useState, useEffect } from 'react';
import styles from './StockPrediction.module.css';

export default function StockPredictionDashboard({ tenantId = "6aec060fbb71bd1b0a3ef9ae" }) {
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState(null);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [spoilageDaysOffset, setSpoilageDaysOffset] = useState(0);

  // const activeTenantId = tenantId || "6aec060fbb71bd1b0a3ef9ae";
  const activeTenantId =  "6aec060fbb71bd1b0a3ef9ae";

  useEffect(() => {
    fetchStockPrediction();
  }, [targetDate, activeTenantId]);

  const fetchStockPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/predictions/${activeTenantId}?targetDate=${targetDate}`);
      const result = await response.json();
      if (result) {
        setPredictionData(result.data || result);
      }
    } catch (error) {
      console.error('Gagal mengambil data prediksi stok:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpoilageRiskStatus = (offset) => {
    if (offset === 0) return { label: 'Optimal & Segar', className: styles.riskBadgeSafe, desc: 'Rekomendasi kulakan harian presisi tinggi.' };
    if (offset <= 2) return { label: 'Perhatian Suhu', className: styles.riskBadgeWarning, desc: 'Mulai perketat kontrol suhu penyimpanan kulkas.' };
    return { label: '⚠️ Risiko Tinggi (Susut/Busuk)', className: styles.riskBadgeDanger, desc: 'Potensi kerugian material akibat kepagian kulakan.' };
  };

  if (loading) {
    return <div className={styles.loading}>Memuat Analisis Otak AI & Data Transaksi...</div>;
  }

  if (!predictionData || !predictionData.rawMaterialShoppingList) {
    return <div className={styles.error}>Belum ada data parameter AI aktif untuk kafe ini.</div>;
  }

  const currentRisk = getSpoilageRiskStatus(spoilageDaysOffset);
  const spoilageFactor = 1 + (spoilageDaysOffset * 0.04);

  return (
    <div className={styles.container}>
      
      {/* --- HEADER --- */}
      <header className={styles.header}>
        <div>
          <div className={styles.badgeWrapper}>
            <span className={styles.pulsingDot}></span>
            <span className={styles.engineLabel}>Bali DigiFest 2026 Engine</span>
          </div>
          <h1 className={styles.title}>AI Stock & Spoilage Intelligence</h1>
          <p className={styles.subtitle}>Optimalisasi rantai pasok kuliner lokal berbasis pemodelan statistik hibrida.</p>
        </div>

        <div className={styles.dateFilterBox}>
          <span className={styles.dateLabel}>Target:</span>
          <input 
            type="date" 
            value={targetDate} 
            onChange={(e) => setTargetDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </header>


      <section className={styles.simulatorCard}>
        <div className={styles.simulatorHeader}>
          <div>
            <h2 className={styles.simulatorTitle}>🧪 Interactive Spoilage Simulator</h2>
            <p className={styles.simulatorDesc}>Simulasi dampak pergeseran jadwal pembelian bahan baku terhadap risiko kerugian.</p>
          </div>
          <span className={styles.offsetPill}>
            Majukan Kulakan: {spoilageDaysOffset} Hari Lebih Awal
          </span>
        </div>

        <input 
          type="range" 
          min="0" 
          max="5" 
          value={spoilageDaysOffset} 
          onChange={(e) => setSpoilageDaysOffset(Number(e.target.value))}
          className={styles.slider}
        />

        <div className={styles.simulatorFooter}>
          <span className={styles.riskDesc}>{currentRisk.desc}</span>
          <span className={currentRisk.className}>
            {currentRisk.label}
          </span>
        </div>
      </section>


      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>▪</span> Daftar Belanja Bahan Baku Rekomendasi AI
          </h2>
          <span className={styles.sectionSubtitle}>Berdasarkan BOM & Prediksi Porsi</span>
        </div>

        <div className={styles.cardsGrid}>
          {predictionData.rawMaterialShoppingList.map((item, index) => {
            const adjustedQuantity = item.totalQuantityNeeded * spoilageFactor;
            return (
              <div key={index} className={styles.card}>
                <div>
                  <span className={styles.ingredientTag}>Bahan Mentah</span>
                  <h3 className={styles.ingredientName}>{item.ingredientName}</h3>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardFooterLabel}>Rekomendasi Beli</span>
                  <div>
                    <span className={styles.cardFooterValue}>
                      {adjustedQuantity.toFixed(1)}
                    </span>
                    <span className={styles.cardFooterUnit}>Unit/Kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>▪</span> Rincian Prediksi Permintaan Menu (Porsi)
          </h2>
          <span className={styles.sectionSubtitle}>Model Statistik Harian & Hari Upacara</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Menu / Produk Jadi</th>
                <th style={{ textAlign: 'right' }}>Prediksi Porsi Terjual Besok</th>
              </tr>
            </thead>
            <tbody>
              {predictionData.menuPredictions && predictionData.menuPredictions.map((menu, index) => (
                <tr key={index}>
                  <td className={styles.menuName}>{menu.menuName}</td>
                  <td className={styles.menuPortion}>
                    {menu.predictedPortions} <span className={styles.menuUnit}>Porsi</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}