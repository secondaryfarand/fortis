import * as tenantRepo from './tenant.repository.js';

export const getTenantByIdService = async (tenantId) => {
  const tenant = await tenantRepo.findTenantById(tenantId);
  if (!tenant) {
    throw new Error("Tenant atau Kafe tidak ditemukan.");
  }
  return tenant;
};

export const getAllTenantsService = async () => {
  const tenants = await tenantRepo.findAllTenants();
  return tenants;
};

export const createTenantService = async (tenantData) => {
  return await tenantRepo.createTenantData(tenantData);
};

export const updateTenantService = async (tenantId, updateData) => {
  const updatedTenant = await tenantRepo.updateTenantData(tenantId, updateData);
  if (!updatedTenant) {
    throw new Error("Gagal memperbarui: Tenant tidak ditemukan.");
  }
  return updatedTenant;
};

export const getMenusByTenantIdService = async (tenantId) => {
  const menus = await tenantRepo.findMenusByTenantId(tenantId);
  return menus;
};