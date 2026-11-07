import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CustomerMenu.module.css';

import CustomerChatbotWidget from '../../chatbot/pages/CustomerChatbotWidget'; 

export default function CustomerMenu() {
  const { tenantId } = useParams(); // Mengambil tenantId dari URL jika ada
  const navigate = useNavigate();

  const [tenantInfo, setTenantInfo] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({}); // Format: { menuId: quantity }

  // Fetch data menu dari backend berdasarkan tenantId
  useEffect(() => {
    const fetchTenantMenus = async () => {
      try {
        setLoading(true);

        // Jika ada tenantId di parameter, ambil khusus tenant tersebut. Jika tidak, ambil semua.
        const endpoint = tenantId 
          ? `/api/v1/tenants/${tenantId}/menus` // Sesuaikan endpoint backend Anda
          : `/api/v1/tenants/menus`;

        const response = await fetch(endpoint);
        const result = await response.json();

        if (response.ok && result.success) {
          setMenus(result.data);
        } else {
          // Fallback data jika belum ada menu di database
          setMenus([]);
        }
      } catch (error) {
        console.error("Gagal memuat daftar menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantMenus();
  }, [tenantId]);

  // Fungsi menambah jumlah item ke keranjang
  const handleAddToCart = (menuId) => {
    setCart(prev => ({
      ...prev,
      [menuId]: (prev[menuId] || 0) + 1
    }));
  };

  // Hitung total item dan total harga
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menus.find(m => m._id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Ambil daftar kategori unik secara dinamis dari data menu yang ada
  const categories = ['Semua', ...new Set(menus.map(menu => menu.category))];

  // Filter menu berdasarkan kategori & kata kunci pencarian
  const filteredMenus = menus.filter(menu => {
    const matchesCategory = selectedCategory === 'Semua' || menu.category === selectedCategory;
    const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

    const handleProceedToOrder = () => {
        localStorage.setItem('customerCart', JSON.stringify(cart));        
        navigate(tenantId ? `/menu/order/${tenantId}` : '/menu/order');
    };

    const cartSummaryText = Object.entries(cart)
    .map(([id, qty]) => {
      const item = menus.find(m => m._id === id);
      return item ? `${item.name} (${qty}x)` : null;
    })
    .filter(Boolean)
    .join(', ');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'sans-serif', color: '#64748b' }}>
        <p>Memuat katalog menu kafe...</p>
      </div>
    );
  }

return (
    <div className={styles.container}>
      {/* Header Kafe / Tenant */}
      <div className={styles.header}>
        <h1 className={styles.tenantTitle}>
          {tenantInfo ? tenantInfo.cafeName : (tenantId ? `Tenant Menu (ID: ${tenantId.substring(0, 6)}...)` : 'Katalog Menu Publik')}
        </h1>
        <p className={styles.tenantSubtitle}>
          📍 Self-Service QR Ordering • Silakan pilih menu dan buat pesanan dari meja Anda
        </p>
      </div>

      {/* Kolom Pencarian Menu */}
      <div className={styles.searchSection}>
        <input 
          type="text" 
          placeholder="Cari menu favoritmu di sini..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Filter Kategori Dinamis */}
      <div className={styles.categoryList}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Daftar Menu dari MenuItem Model */}
      <div className={styles.menuGrid}>
        {filteredMenus.length > 0 ? (
          filteredMenus.map(menu => (
            <div key={menu._id} className={styles.menuCard}>
              <div className={styles.menuImageWrapper}>
                <img 
                  src={menu.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80'} 
                  alt={menu.name} 
                  className={styles.menuImage} 
                />
              </div>
              <div className={styles.menuInfo}>
                <h3 className={styles.menuName}>{menu.name}</h3>
                <p className={styles.menuDesc}>
                  {menu.description || `Kategori: ${menu.category} • Komposisi bahan tersedia`}
                </p>
              </div>
              <div className={styles.menuFooter}>
                <span className={styles.menuPrice}>Rp {(menu.price || 0).toLocaleString('id-ID')}</span>
                <button 
                  onClick={() => handleAddToCart(menu._id)} 
                  className={styles.addButton}
                  title="Tambah ke Keranjang"
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>Belum ada menu yang terdaftar untuk tenant ini.</p>
          </div>
        )}
      </div>

      {/* Bar Keranjang Melayang di Bawah (Floating Cart Bar) */}
      {totalItems > 0 && (
        <div className={styles.floatingCartBar} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            🛒 <strong>Ringkasan:</strong> {cartSummaryText}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={styles.cartInfo}>
              <span className={styles.cartCount}>{totalItems} Item Dipilih</span>
              <span className={styles.cartTotal}>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={handleProceedToOrder} className={styles.orderBtn}>
              Lanjut Pesan →
            </button>
          </div>
        </div>
      )}

      {/* 🤖 Widget Chatbot Pelanggan dipasang di dalam return utama */}
      <CustomerChatbotWidget tenantId={tenantId} />

    </div> // Tutup tag pembungkus utama (styles.container)
  );
}