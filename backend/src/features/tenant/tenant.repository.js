import Tenant from '../../models/Tenant.model.js';
import MenuItem from '../../models/MenuItem.model.js';

export const findTenantById = async (tenantId) => {
  return await Tenant.findById(tenantId);
};

export const findAllTenants = async () => {
  return await Tenant.find({}).sort({ cafeName: 1 }); 
};

export const createTenantData = async (tenantData) => {
  return await Tenant.create(tenantData);
};

export const updateTenantData = async (tenantId, updateData) => {
  return await Tenant.findByIdAndUpdate(tenantId, updateData, { new: true });
};

export const findMenusByTenantId = async (tenantId) => {
  let query = {};
  if (tenantId) {
    query.tenantId = tenantId;
  }
  return await MenuItem.find(query);
};