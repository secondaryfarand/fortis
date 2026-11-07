import mongoose from 'mongoose';

const customerChatbotSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true,
    index: true 
  },
  category: {
    type: String,
    required: true,
    enum: ['Menu & Harga', 'Jam Operasional', 'Pembayaran', 'Fasilitas & Lokasi', 'Lainnya'],
    default: 'Lainnya',
    index: true
  },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  keywords: [{ type: String, trim: true }], 
  isActive: { type: Boolean, default: true, index: true } 
}, { timestamps: true });

const CustomerChatbot = mongoose.model('CustomerChatbot', customerChatbotSchema);
export default CustomerChatbot;