import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AiAdvisorCard({ tenantId }) {
  const [loading, setLoading] = useState(false);
  const [insightResult, setInsightResult] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [tenantInfo, setTenantInfo] = useState(null);

  useEffect(() => {
    if (!tenantId) return;
    
    fetch(`/api/v1/tenants/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setTenantInfo(data.data);
        }
      })
      .catch(err => console.log("Info tenant termuat dari konteks lokal."));
  }, [tenantId]);

  const handleAskAi = async (promptText) => {
    if (!promptText.trim()) return;

    try {
      setLoading(true);
      setInsightResult('');

      const response = await fetch(`/api/v1/insights/${tenantId}/ai-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setInsightResult(result.data.analysis);
      } else {
        setInsightResult('Gagal memuat analisis dari AI.');
      }
    } catch (error) {
      console.error("Error fetching AI insight:", error);
      setInsightResult('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
      padding: '1.5rem',
      fontFamily: "'Poppins', sans-serif",
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginTop: '1.5rem'
    }}>
      {/* Header & Informasi Tenant */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fa-solid fa-brain" style={{ color: '#f59e0b', fontSize: '1.25rem' }}></i>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Fortis RAG AI Business Advisor</h3>
        </div>
        
        <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600' }}>
          🏢 {tenantInfo?.cafeName || `Tenant ID: ${tenantId ? tenantId.substring(0, 8) + '...' : 'Global'}`}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
        AI menganalisis data menu secara <i>real-time</i> dari database MongoDB khusus untuk tenant ini menggunakan Gemini API.
      </p>

      {/* Tombol Saran Cepat */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button 
          onClick={() => handleAskAi("Analisis menu apa yang paling potensial untuk dijadikan paket bundling promosi.")}
          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          💡 Ide Paket Bundling Menu
        </button>
        <button 
          onClick={() => handleAskAi("Berikan strategi pricing/harga untuk meningkatkan profit margin kafe.")}
          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          📈 Strategi Optimalisasi Harga
        </button>
      </div>

      {/* Input Teks Bebas */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text"
          placeholder="Atau tanyakan sesuatu pada AI seputar menu/bisnis kafe ini..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskAi(customPrompt)}
          style={{
            flex: 1,
            padding: '0.6rem 0.75rem',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif"
          }}
        />
        <button 
          onClick={() => handleAskAi(customPrompt)}
          disabled={loading || !customPrompt.trim()}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            padding: '0.6rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: '500',
            opacity: (!customPrompt.trim() || loading) ? 0.6 : 1
          }}
        >
          Kirim 🚀
        </button>
      </div>

      {/* Indikator Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i> AI sedang membaca data database tenant dan menyusun analisis...
        </div>
      )}

      {/* Hasil Analisis RAG dengan ReactMarkdown */}
      {insightResult && !loading && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          fontSize: '0.85rem',
          color: '#334155',
          lineHeight: '1.7',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>Analisis Konsultan AI:</strong>
            <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>Powered by Gemini Flash</span>
          </div>

          {/* Menggunakan ReactMarkdown untuk merapikan heading, list, bold, dll */}
          <div className="markdown-body" style={{ color: '#1e293b' }}>
            <ReactMarkdown
              components={{
                h3: ({node, ...props}) => <h3 style={{ fontSize: '1rem', color: '#0f172a', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }} {...props} />,
                p: ({node, ...props}) => <p style={{ margin: '0.5rem 0' }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: '0.3rem' }} {...props} />,
                hr: ({node, ...props}) => <hr style={{ border: '0', borderTop: '1px solid #cbd5e1', margin: '1rem 0' }} {...props} />
              }}
            >
              {insightResult}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}