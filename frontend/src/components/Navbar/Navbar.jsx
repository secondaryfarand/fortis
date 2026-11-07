import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Tentukan menu berdasarkan role atau status login pengguna
  let navItems = [];

  if (!currentUser) {
    // Menu untuk Pengunjung / Customer Publik (Belum Login)
    navItems = [
      { path: '/menu/6aec060fbb71bd1b0a3ef9ae', label: 'Menu & Pesan', icon: 'fa-utensils' },
      { path: '/auth/login', label: 'Login Owner/Kasir', icon: 'fa-right-to-bracket' },
      { path: '/auth/register', label: 'Register', icon: 'fa-right-to-bracket' }
    ];
  } else if (currentUser.role === 'cashier') {
    // Menu Khusus Kasir
    navItems = [
      { path: '/cashier', label: 'Panel Kasir (POS)', icon: 'fa-cash-register' }
    ];
  } else {
    // Menu untuk Owner / Tenant Admin (Dinamis dengan tenantId)
    const tenantId = currentUser.tenantId;

    navItems = [
      { path: '/stock-dashboard', label: 'Dashboard Prediksi', icon: 'fa-chart-line' },
      { path: '/insight-advice', label: 'AI Advice', icon: 'fa-brain' }, 
      { path: '/insight', label: 'Insight AI', icon: 'fa-brain' },
      // Mengarahkan langsung ke rute menu spesifik tenant
      { path: tenantId ? `/menu/${tenantId}` : '/menu', label: 'Menu & Resep', icon: 'fa-book-open' },
      { path: '/cashier', label: 'Kasir POS', icon: 'fa-cash-register' },
      // { path: '/supplier', label: 'Nota Supplier', icon: 'fa-receipt' },
      { path: tenantId ? `/settings/chatbot/${tenantId}` : '/settings/chatbot', label: 'Chatbot AI', icon: 'fa-robot' }
    ];
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Brand / Logo Fortis */}
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <i className="fa-solid fa-shield-halved"></i>
          <span>Fortis</span>
          {currentUser && (
            <span className={styles.roleBadge}>
              {currentUser.role === 'cashier' ? 'Kasir' : 'Owner'}
            </span>
          )}
        </Link>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle Menu">
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Navigation Links Dinamis */}
        <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
          {navItems.map((item, index) => (
            <NavLink 
              key={index}
              to={item.path} 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={closeMenu}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Tombol Logout khusus jika sudah login */}
          {currentUser && (
            <button 
              onClick={() => { onLogout(); closeMenu(); }} 
              className={styles.mobileLogoutBtn}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout ({currentUser.name})</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}