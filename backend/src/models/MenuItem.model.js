import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true,
    index: true 
  },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  ingredients: [
    {
      ingredientName: { type: String, required: true, trim: true },
      quantityRequiredPerPortion: { type: Number, required: true, min: 0 } // Kebutuhan per 1 porsi
    }
  ]
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;

