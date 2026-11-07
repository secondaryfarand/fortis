import * as chatbotRepo from './customerChatbot.repository.js';

// Fungsi helper NLP: Tokenisasi teks sederhana (lowercase & pisah kata)
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(Boolean);
};

// Fungsi helper: Menghitung Cosine Similarity manual antara dua teks
const calculateCosineSimilarity = (str1, str2) => {
  const words1 = tokenize(str1);
  const words2 = tokenize(str2);

  const uniqueWords = [...new Set([...words1, ...words2])];

  // Hitung Vector Term Frequency
  const vec1 = uniqueWords.map(word => words1.filter(w => w === word).length);
  const vec2 = uniqueWords.map(word => words2.filter(w => w === word).length);

  // Dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < uniqueWords.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
};

export const processCustomerChatbotService = async (tenantId, userQuery) => {
  if (!userQuery) {
    throw new Error("Pertanyaan tidak boleh kosong.");
  }

  // 1. Ambil data FAQ aktif khusus tenant tersebut dari database
  const faqs = await chatbotRepo.findActiveChatbotFaqsByTenantRepo(tenantId);

  if (!faqs || faqs.length === 0) {
    return {
      answer: "Maaf, belum ada informasi chatbot yang tersedia untuk kafe ini.",
      score: 0
    };
  }

  // 2. Hitung tingkat kemiripan (Cosine Similarity) terhadap setiap pertanyaan FAQ
  let bestMatchIndex = -1;
  let highestScore = 0;

  faqs.forEach((faq, index) => {
    // Cek kemiripan dengan pertanyaan utama
    let score = calculateCosineSimilarity(userQuery, faq.question);

    // Opsional: Cek juga kemiripan dengan keyword pendukung jika ada
    if (faq.keywords && faq.keywords.length > 0) {
      faq.keywords.forEach(kw => {
        const kwScore = calculateCosineSimilarity(userQuery, kw);
        if (kwScore > score) score = kwScore;
      });
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatchIndex = index;
    }
  });

  // 3. Tentukan Threshold (ambang batas kemiripan teks, misal 0.2 atau 20%)
  const THRESHOLD = 0.2;

  if (highestScore < THRESHOLD || bestMatchIndex === -1) {
    return {
      answer: "Maaf, saya kurang memahami pertanyaan Anda. Silakan tanyakan hal seputar menu, jam operasional, atau fasilitas kafe ini.",
      score: highestScore
    };
  }

  // 4. Kembalikan jawaban terbaik
  return {
    answer: faqs[bestMatchIndex].answer,
    score: highestScore
  };
};


export const getTenantChatbotFaqsService = async (tenantId) => {
  return await chatbotRepo.findAllChatbotFaqsByTenantRepo(tenantId);
};

// Tambah FAQ baru
export const addCustomerChatbotFaqService = async (faqData) => {
  if (!faqData.question || !faqData.answer || !faqData.tenantId) {
    throw new Error("Tenant ID, pertanyaan, dan jawaban wajib diisi.");
  }
  return await chatbotRepo.createChatbotFaqRepo(faqData);
};

// Update FAQ
export const updateCustomerChatbotFaqService = async (faqId, updateData) => {
  const updated = await chatbotRepo.updateChatbotFaqRepo(faqId, updateData);
  if (!updated) {
    throw new Error("Data FAQ chatbot tidak ditemukan.");
  }
  return updated;
};

// Hapus FAQ
export const deleteCustomerChatbotFaqService = async (faqId) => {
  const deleted = await chatbotRepo.deleteChatbotFaqRepo(faqId);
  if (!deleted) {
    throw new Error("Data FAQ chatbot tidak ditemukan.");
  }
  return deleted;
};