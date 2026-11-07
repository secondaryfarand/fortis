import mongoose from 'mongoose';

const aiParameterSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true, 
    unique: true,
    index: true 
  },
  lastUpdated: { type: Date, default: Date.now },
  
  // Bobot / Parameter Prediksi Stok Dinamis per Kafe
  stockCoefficients: {
    baseMultiplier: { type: Number, default: 1.0 },
    ceremonyMultiplier: { type: Number, default: 1.25 }, // Lonjakan saat hari raya
    dayOfWeekWeights: { type: [Number], default: [1, 1, 1, 1, 1, 1.2, 1.3] } // Bobot hari Senin-Minggu
  },

  // Ringkasan Clustering Pelanggan
  customerClustersSummary: [
    {
      clusterName: { type: String }, // e.g., 'Pelanggan Setia', 'Pengunjung Weekend'
      averageSpent: { type: Number },
      recommendedAction: { type: String }
    }
  ]
}, { timestamps: true });

const AIParameter = mongoose.model('AIParameter', aiParameterSchema);
export default AIParameter;