import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Nanti bisa di-hash menggunakan bcrypt
  role: { 
    type: String, 
    enum: ['tenant_admin', 'cashier', 'customer'], 
    default: 'customer' 
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: function() { return this.role !== 'customer'; } // Customer bisa publik / anonim, staf wajib punya tenant
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');

export default User;