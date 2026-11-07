import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'; 
import LoginForm from './features/auth/pages/LoginForm';
import RegisterForm from './features/auth/pages/RegisterForm';
import StockPredictionDashboard from './features/dashboard/pages/StockPredictionDashboard'; 
import CashierDashboard from './features/cashier/pages/CashierDashboard'; 
import MarketBasketInsights from './features/mba/pages/MarketBasketInsights'; 
import CustomerMenu from './features/menu/pages/CustomerMenu';
import CustomerOrder from './features/menu/pages/CustomerOrder';
import CustomerOrderSuccess from './features/menu/pages/CustomerOrderSuccess';
import ChatbotManager from './features/chatbot/pages/ChatbotManager';
import styles from './App.module.css'; 
import CustomerChatbotWidget from './features/chatbot/pages/CustomerChatbotWidget';
import AiAdvisorCard from './features/insightAdvice/AiAdvisorCard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const currentTenantId = currentUser?.tenantId || localStorage.getItem('tenantId') || '';

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.tenantId) {
      localStorage.setItem('tenantId', userData.tenantId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className={styles.appContainer} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar Navigasi Utama */}
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <main className={styles.mainContent} style={{ flex: 1 }}>
          <Routes>
            <Route path="/menu" element={<CustomerMenu />} />
            <Route path="/menu/:tenantId" element={<CustomerMenu />} />
            <Route path="/menu/order/:tenantId" element={<CustomerOrder />} />
            <Route path="/menu/order" element={<CustomerOrder />} />
            <Route path="/menu/success/:tenantId" element={<CustomerOrderSuccess />} />
            
            {/* <Route 
              path="/menu/:tenantId" 
              element={<CustomerChatbotWidget />} 
            /> */}

            {/* <Route 
              path="/menu" 
              element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2>🍽️ Halaman Menu Publik (Self-Service QR Pelanggan)</h2>
                  <p>Pelanggan dapat melihat daftar menu dan memesan langsung dari meja tanpa harus login.</p>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link to="/auth/login" style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
                      Masuk sebagai Staf / Owner
                    </Link>
                  </div>
                </div>
              } 
            /> */}

            {/* Rute Auth */}
            <Route 
              path="/auth/register" 
              element={
                currentUser ? <Navigate to="/" replace /> : <RegisterForm onRegisterSuccess={handleAuthSuccess} />
              } 
            />
            <Route 
              path="/auth/login" 
              element={
                currentUser ? <Navigate to="/" replace /> : <LoginForm onLoginSuccess={handleAuthSuccess} />
              } 
            />

            {/* ========================================================= */}
            {/* RUTE TERPROTEKSI (Wajib Login untuk Admin / Kasir)        */}
            {/* ========================================================= */}
            <Route 
              path="/" 
              element={
                !currentUser ? (
                  <Navigate to="/menu" replace /> // Jika belum login, diarahkan ke halaman menu publik / landing page
                ) : (
                  <StockPredictionDashboard tenantId={currentTenantId} user={currentUser} />
                )
              } 
            />

            <Route 
              path="/insight" 
              element={
                !currentUser ? (
                  <Navigate to="/auth/login" replace />
                ) : (
                  <MarketBasketInsights tenantId={currentTenantId} user={currentUser} />
                )
              } 
            />

            <Route 
              path="/insight-advice" 
              element={
                !currentUser ? (
                  <Navigate to="/auth/login" replace />
                ) : (
                <AiAdvisorCard tenantId={currentUser.tenantId} user={currentUser} />                )
              } 
            />

            <Route 
              path="/settings/chatbot/:tenantId" 
              element={
                !currentUser ? (
                  <Navigate to="/auth/login" replace />
                ) : (
                  <ChatbotManager tenantId={window.location.pathname.split('/').pop()} user={currentUser} />
                )
              } 
            />
            
            <Route 
              path="/cashier" 
              element={
                !currentUser ? (
                  <Navigate to="/auth/login" replace />
                ) : (
                  <CashierDashboard tenantId={currentTenantId} user={currentUser} />
                )
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end', 
          alignItems: 'center',
          padding: '0.75rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid #e2e8f0',
          fontFamily: "'Poppins', sans-serif"
        }}>
          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '0.4rem 0.4rem 0.4rem 1rem',
              borderRadius: '2rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              {/* Informasi Ringkas User */}
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0f172a' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </div>

              {/* Tombol Logout Elegan */}
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1rem',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '1.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Keluar
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Status: Belum Login. <Link to="/auth/login" style={{ color: '#d97706', fontWeight: '600', textDecoration: 'none' }}>Masuk</Link> atau kunjungi <Link to="/menu" style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>Menu Publik</Link>
            </div>
          )}
        </div>

        <footer className={styles.footer} style={{
          textAlign: 'center',
          padding: '1.5rem 1rem',
          fontSize: '0.8rem',
          color: '#64748b',
          borderTop: '1px solid #e2e8f0',
          marginTop: '2rem',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <p style={{ margin: 0 }}>
            <i className="fa-regular fa-copyright" style={{ marginRight: '0.3rem' }}></i> 2026 Bali DigiFest Project. AI-Powered Culinary SaaS for Smart SMEs.
          </p>
        </footer>
      </div>
    </Router>
  );
}