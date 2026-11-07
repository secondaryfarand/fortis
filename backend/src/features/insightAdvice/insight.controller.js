import MenuItem from '../../models/MenuItem.model.js';
import { callGeminiWithFallback } from '../../utils/geminiHelper.js';

export const getAiBusinessInsight = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { prompt } = req.body;

    // 1. RETRIEVE: Ambil data riil menu dari MongoDB milik tenant ini
    const menus = await MenuItem.find({ tenantId }).lean();
    const menuSummary = menus.length > 0 
      ? menus.map(m => `- ${m.name} (${m.category}): Rp ${m.price}`).join('\n')
      : 'Belum ada menu terdaftar.';

    // 2. GENERATE dengan RAG & Fallback Rolling API Keys
    const aiResponseText = await callGeminiWithFallback('RAG AI Business Advisor', async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Anda adalah AI Business Advisor profesional untuk sistem SaaS kuliner bernama Fortis. 
Berikut adalah data inventaris menu kafe saat ini dari database:
${menuSummary}

Pertanyaan/Permintaan Owner: "${prompt || 'Berikan analisis singkat dan rekomendasi strategi penjualan untuk menu-menu di kafe ini agar omzet meningkat.'}"`
              }
            ]
          }
        ],
        config: {
          systemInstruction: 'Berikan analisis bisnis yang tajam, solutif, menggunakan bahasa Indonesia yang ramah dan profesional. Gunakan format Markdown yang bersih (seperti sub-heading ###, teks tebal **, dan list bullet).',
          temperature: 0.7,
        }
      });

      return response.text || 'Maaf, saya tidak dapat merespons analisis saat ini.';
    });

    res.status(200).json({
      success: true,
      data: {
        analysis: aiResponseText,
        dataSourceCount: menus.length
      }
    });

  } catch (error) {
    console.error("Controller RAG Error:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghasilkan analisis AI dari server.', 
      error: error.message 
    });
  }
};