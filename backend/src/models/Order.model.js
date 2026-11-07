import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true,
    index: true 
  },
  customerName: { type: String, default: 'Tamu' },
  tableNumber: { type: String, required: true },
  notes: { type: String, default: '' },
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled'], 
    default: 'pending',
    index: true 
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;