import * as predictionService from './prediction.service.js';

/**
 * Controller untuk menangani endpoint HTTP prediksi stok
 */
export const getStockPrediction = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { targetDate } = req.query; // Format YYYY-MM-DD (opsional)

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID wajib disertakan dalam parameter URL.'
      });
    }

    const predictionResult = await predictionService.calculateTenantStockPrediction(tenantId, targetDate);

    return res.status(200).json({
      success: true,
      message: 'Prediksi kebutuhan stok dan bahan baku berhasil dihasilkan.',
      data: predictionResult
    });

  } catch (error) {
    console.error('Error in getStockPrediction controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat memproses prediksi stok.',
      error: error.message
    });
  }
};