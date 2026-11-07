import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.container}>

      {/* Hero Section */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Revolusi Manajemen Kafe & <br />
          <span>Smart Business Advisor</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Platform SaaS operasional kafe modern dengan 4 mesin AI canggih untuk prediksi rantai pasok, analisis keranjang belanja, chatbot pelayanan, dan konsultan bisnis RAG real-time.
        </p>
        <div className={styles.heroActions}>
          <Link to="/menu/6aec060fbb71bd1b0a3ef9ae" className={styles.primaryBtn}>
            <i className="fa-solid fa-qrcode"></i> Menu Order
          </Link>
          <Link to="/auth/login" className={styles.secondaryBtn}>
            <i className="fa-solid fa-chart-line"></i> Dashboard Owner
          </Link>
        </div>
      </header>

      {/* Problem & Solution Section */}
      <section id="problem" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Tantangan Industri Kuliner & Solusi Kami</h2>
          <p>Mengapa UMKM kafe membutuhkan otomatisasi cerdas Fortis</p>
        </div>
        <div className={styles.grid2}>
          <div className={styles.cardProblem}>
            <h3>❌ Masalah Utama di Lapangan</h3>
            <ul>
              <li><strong>Risiko Stockout & Kedaluwarsa:</strong> Kesulitan memprediksi kapan bahan baku mentah habis atau kelebihan stok.</li>
              <li><strong>Buta Data Tren Penjualan:</strong> Tidak tahu menu apa yang paling sering dibeli bersamaan oleh pelanggan.</li>
              <li><strong>Biaya Konsultan Mahal:</strong> UMKM tidak punya anggaran untuk menyewa analis data atau konsultan bisnis.</li>
            </ul>
          </div>
          <div className={styles.cardSolution}>
            <h3>✅ Solusi Komprehensif Fortis</h3>
            <ul>
              <li><strong>Supply Chain Prediction:</strong> Estimasi kebutuhan restock harian secara presisi untuk cegah pemborosan.</li>
              <li><strong>Market Basket Analysis (MBA):</strong> Menemukan pola pembelian silang (*bundling*) untuk dongkrak omzet.</li>
              <li><strong>LLM RAG Business Advisor:</strong> Konsultan AI instan yang membaca langsung data inventaris dari database.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Multi-AI Engines Section */}
      <section id="features" className={styles.sectionDark}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.textWhite}>Ekosistem Multi-AI Engine</h2>
          <p className={styles.textGray}>Empat pilar kecerdasan buatan yang bekerja secara sinergis</p>
        </div>
        <div className={styles.grid4}>
          <div className={styles.aiCard}>
            <div className={styles.aiIcon}>📦</div>
            <h3>Supply Chain</h3>
            <p>Prediksi otomatis kapan bahan dasar habis berdasarkan tren konsumsi penjualan harian.</p>
          </div>
          <div className={styles.aiCard}>
            <div className={styles.aiIcon}>🛒</div>
            <h3>Market Basket</h3>
            <p>Association Rule Mining untuk mengidentifikasi kombinasi menu favorit pelanggan.</p>
          </div>
          <div className={styles.aiCard}>
            <div className={styles.aiIcon}>💬</div>
            <h3>NLP Chatbot</h3>
            <p>Pencarian FAQ mandiri di browser menggunakan TF-IDF & Cosine Similarity.</p>
          </div>
          <div className={styles.aiCard}>
            <div className={styles.aiIcon}>🧠</div>
            <h3>LLM RAG Advisor</h3>
            <p>Google Gemini API yang mengekstrak data faktual inventaris MongoDB per tenant.</p>
          </div>
        </div>
      </section>

      {/* Workflow & RBAC Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Arsitektur Operasional & Peran (RBAC)</h2>
          <p>Pemisahan akses yang aman dan efisien untuk seluruh lini kafe</p>
        </div>
        <div className={styles.grid3}>
          <div className={styles.roleCard}>
            <span className={styles.roleBadge}>Role 1</span>
            <h3>Customer</h3>
            <p>Memindai QR Code di meja untuk melihat katalog menu dan memesan secara mandiri tanpa antre.</p>
          </div>
          <div className={styles.roleCard}>
            <span className={styles.roleBadge}>Role 2</span>
            <h3>Kasir (Store Staff)</h3>
            <p>Memantau pesanan masuk secara real-time dan mengonfirmasi status pembayaran (*payment confirmation*).</p>
          </div>
          <div className={styles.roleCard}>
            <span className={styles.roleBadge}>Role 3</span>
            <h3>Tenant Owner</h3>
            <p>Mengakses dashboard analitik bisnis, manajemen menu, serta wawasan mendalam dari AI Business Advisor.</p>
          </div>
        </div>
      </section>

      
    </div>
  );
}