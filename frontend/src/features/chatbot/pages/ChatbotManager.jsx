import React, { useState, useEffect } from 'react';
import styles from './ChatbotManager.module.css';

export default function ChatbotManager({ tenantId }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    category: 'Menu & Harga',
    question: '',
    answer: '',
    keywords: '',
    isActive: true
  });

  // Ambil data FAQ tenant
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      if (!tenantId) return;

      const response = await fetch(`/api/v1/customer-chatbot/${tenantId}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setFaqs(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat data chatbot:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [tenantId]);

  // Buka modal untuk tambah baru
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      category: 'Menu & Harga',
      question: '',
      answer: '',
      keywords: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Buka modal untuk edit data
  const handleOpenEditModal = (faq) => {
    setEditingId(faq._id);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      keywords: faq.keywords ? faq.keywords.join(', ') : '',
      isActive: faq.isActive
    });
    setIsModalOpen(true);
  };

  // Simpan data (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        tenantId,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : []
      };

      const endpoint = editingId 
        ? `/api/v1/customer-chatbot/${editingId}`
        : `/api/v1/customer-chatbot`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert(result.message || 'Gagal menyimpan data.');
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert('Terjadi kesalahan koneksi.');
    }
  };

  // Hapus FAQ
  const handleDelete = async (faqId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pertanyaan ini dari chatbot?")) return;

    try {
      const response = await fetch(`/api/v1/customer-chatbot/${faqId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFaqs(prev => prev.filter(f => f._id !== faqId));
      } else {
        alert('Gagal menghapus data.');
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Halaman */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🤖 Manajemen Pengetahuan Chatbot Pelanggan</h1>
          <p className={styles.subtitle}>Atur daftar tanya-jawab otomatis yang akan dijawab oleh AI NLP kafe Anda.</p>
        </div>
        <button onClick={handleOpenAddModal} className={styles.addBtn}>
          <i className="fa-solid fa-plus"></i> Tambah Pertanyaan Baru
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Memuat data pengetahuan...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Pertanyaan & Keyword</th>
                <th>Jawaban AI</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length > 0 ? (
                faqs.map(faq => (
                  <tr key={faq._id}>
                    <td>
                      <span className={styles.categoryBadge}>{faq.category}</span>
                    </td>
                    <td>
                      <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#0f172a' }}>{faq.question}</strong>
                      {faq.keywords && faq.keywords.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          🔑 Keywords: {faq.keywords.join(', ')}
                        </span>
                      )}
                    </td>
                    <td style={{ maxWidth: '350px' }}>{faq.answer}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${faq.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {faq.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className={styles.actionBtns} style={{ justifyContent: 'center' }}>
                        <button onClick={() => handleOpenEditModal(faq)} className={styles.editBtn} title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => handleDelete(faq._id)} className={styles.deleteBtn} title="Hapus">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Belum ada data pertanyaan chatbot yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>
              {editingId ? 'Edit Pertanyaan Chatbot' : 'Tambah Pertanyaan Chatbot'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Kategori</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={styles.select}
                >
                  <option value="Menu & Harga">Menu & Harga</option>
                  <option value="Jam Operasional">Jam Operasional</option>
                  <option value="Pembayaran">Pembayaran</option>
                  <option value="Fasilitas & Lokasi">Fasilitas & Lokasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pertanyaan Pelanggan *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Apa saja menu kopi andalan di sini?" 
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Jawaban Bot *</label>
                <textarea 
                  required
                  placeholder="Tuliskan jawaban yang akurat..." 
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Kata Kunci Alternatif (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: kopi, menu kopi, espresso, latte" 
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                />
                <label htmlFor="isActiveCheck" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Aktifkan chatbot untuk menjawab pertanyaan ini
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                  Batal
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Simpan Perubahan' : 'Tambah Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}