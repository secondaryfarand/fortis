import mongoose from 'mongoose';

const menuReferenceSchema = new mongoose.Schema({
  menuName: { type: String, required: true },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', default: null }
}, { _id: false });

const mbaRecommendationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  ifUserBuys: [menuReferenceSchema],
  thenRecommend: [menuReferenceSchema],
  support: { type: Number, required: true },
  confidence: { type: Number, required: true },
  lift: { type: Number, required: true }
}, {
  timestamps: true
});

const MBARecommendation = mongoose.model('MBARecommendation', mbaRecommendationSchema, 'mbarecommendations');

export default MBARecommendation;