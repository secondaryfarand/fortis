import * as userRepo from './user.repository.js';
import Tenant from '../../models/Tenant.model.js';

export const registerUserService = async (payload) => {
  const existingUser = await userRepo.findUserByEmail(payload.email);
  if (existingUser) {
    throw new Error("Email akun sudah terdaftar di dalam sistem.");
  }

  let assignedTenantId = payload.tenantId || null;

  if (payload.role === 'tenant_admin') {
    if (!payload.cafeName) {
      throw new Error("Nama kafe wajib diisi untuk pendaftaran Tenant Admin.");
    }

    const existingTenant = await Tenant.findOne({ cafeName: payload.cafeName });
    if (existingTenant) {
      throw new Error(`Nama tenant "${payload.cafeName}" sudah terdaftar. Silakan gunakan nama lain atau tambahkan identitas cabang.`);
    }

    const tenantEmail = payload.tenantEmail || payload.email;

    const newTenant = await Tenant.create({
      cafeName: payload.cafeName,
      ownerName: payload.ownerName || payload.name,
      email: tenantEmail,
      businessType: payload.businessType || 'Coffee Shop',
      address: payload.address || ''
    });

    assignedTenantId = newTenant._id;
  }

  const userDataToCreate = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    tenantId: assignedTenantId
  };

  const newUser = await userRepo.createUser(userDataToCreate);
  return newUser;
};

export const loginUserService = async (email, password) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Email atau kata sandi salah.");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId || null
  };
};