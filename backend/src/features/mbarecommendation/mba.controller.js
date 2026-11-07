import * as mbaService from './mba.service.js';

export const getMarketBasketInsights = async (req, res) => {
  try {
    // Ambil tenantId dari parameter URL, contoh: /api/v1/insights/market-basket/:tenantId
    // Atau fallback ke tenant default Anda jika belum pakai auth dinamis
    const tenantId = req.params.tenantId || "6aec060fbb71bd1b0a3ef9ae";

    const insights = await mbaService.getMarketBasketInsightsService(tenantId);
    
    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("Gagal mengambil wawasan MBA:", error.message);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat mengambil Market Basket Insights."
    });
  }
};