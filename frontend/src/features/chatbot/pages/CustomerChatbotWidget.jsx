import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomerChatbotWidget.module.css';

export default function CustomerChatbotWidget({ tenantId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Selamat datang di kafe kami. Ada yang bisa saya bantu seputar menu, jam operasional, atau fasilitas?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');

    // Tambahkan pesan user ke state
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Kirim pertanyaan ke backend endpoint NLP chatbot tenant
      const response = await fetch(`/api/v1/customer-chatbot/${tenantId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText })
      });

      const result = await response.json();

      setIsTyping(false);

      if (response.ok && result.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: result.data.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Maaf, terjadi gangguan pada sistem chatbot kami.' }]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Maaf, koneksi ke server bermasalah.' }]);
    }
  };

  return (
    <div>
      {/* Tombol Floating */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className={styles.floatingBtn} aria-label="Buka Chatbot">
          <i className="fa-solid fa-robot"></i>
        </button>
      )}

      {/* Jendela Kotak Chat */}
      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <h3>Asisten Virtual Kafe</h3>
              <p>Tanya apa saja seputar kafe ini</p>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn} aria-label="Tutup Chat">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={styles.chatFooter}>
            <input 
              type="text" 
              placeholder="Ketik pertanyaan Anda..." 
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendBtn} aria-label="Kirim Pesan">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}