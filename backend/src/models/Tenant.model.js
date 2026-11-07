import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  cafeName: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  businessType: { 
    type: String, 
    enum: ['Coffee Shop', 'Warung Tradisional', 'Bakery', 'Restaurant', 'Angkringan', 'Rumah Makan', 'Stand F&B', 'Lainnya'],
    required: true 
  },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;