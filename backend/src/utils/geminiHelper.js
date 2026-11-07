import { GoogleGenAI } from '@google/genai';



const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY,
].filter(Boolean);

let currentKeyIndex = 0;

export const apiMonitorStats = {
  totalRequests: 0,
  keyUsageCount: new Array(apiKeys.length).fill(0),
  lastActiveKey: null,
};

export async function callGeminiWithFallback(taskName, aiTaskFn) {
  if (apiKeys.length === 0) {
    throw new Error('Tidak ada API Key Gemini yang dikonfigurasi di file .env');
  }

  let attempts = 0;
  const startTime = performance.now();

  while (attempts < apiKeys.length) {
    const activeKey = apiKeys[currentKeyIndex];
    const maskedKey = `...${activeKey.slice(-4)}`;
    const keyLabel = `API Key #${currentKeyIndex + 1} [${maskedKey}]`;

    console.log(`[AI Log] Memulai Task: "${taskName}" menggunakan ${keyLabel}`);

    try {
      apiMonitorStats.totalRequests++;
      apiMonitorStats.keyUsageCount[currentKeyIndex]++;
      apiMonitorStats.lastActiveKey = keyLabel;

      const aiInstance = new GoogleGenAI({ apiKey: activeKey });
      
      const result = await aiTaskFn(aiInstance);
      
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`[AI Log] Task "${taskName}" BERHASIL! Durasi: ${duration}s | Menggunakan ${keyLabel}`);

      return result;

    } catch (error) {
      console.warn(`[AI Log] Task "${taskName}" GAGAL pada ${keyLabel}. Pesan Error:`, error.message);

      const isRateLimit = error.status === 429 || error.code === 429;
      const isServiceUnavailable = error.status === 503 || error.code === 503 || (error.message && error.message.toLowerCase().includes('high demand'));

      const shouldFallback = (isRateLimit || isServiceUnavailable);

      if (shouldFallback && attempts < apiKeys.length - 1) {
        console.warn(`[AI Log] Kendala kuota/server terdeteksi. Merotasi otomatis ke API Key berikutnya...`);
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempts++;
      } else {
        console.error(`[AI Log] Task "${taskName}" benar-benar gagal total.`);
        throw error;
      }
    }
  }

  throw new Error('Semua API Key Gemini telah mencapai batas limit.');
}