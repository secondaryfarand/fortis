import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true,
    index: true 
  },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true, min: 0 }
    }
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  saleDate: { type: Date, default: Date.now, index: true },
  
  // Konteks Pendukung Lokal Bali untuk Model AI
  isCeremonyDay: { type: Boolean, default: false }, // Penanda hari raya/upacara adat
  dayOfWeek: { type: Number, min: 0, max: 6 } // 0 (Minggu) sampai 6 (Sabtu)
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;