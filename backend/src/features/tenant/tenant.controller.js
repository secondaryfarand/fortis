import * as tenantService from './tenant.service.js';

export const getTenantInfo = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await tenantService.getTenantByIdService(tenantId);
    
    return res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllTenants = async (req, res) => {
  try {
    const tenants = await tenantService.getAllTenantsService();
    
    return res.status(200).json({
      success: true,
      data: tenants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createNewTenant = async (req, res) => {
  try {
    const newTenant = await tenantService.createTenantService(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Tenant berhasil ditambahkan.",
      data: newTenant
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTenantInfo = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const updatedTenant = await tenantService.updateTenantService(tenantId, req.body);
    
    return res.status(200).json({
      success: true,
      message: "Data tenant berhasil diperbarui.",
      data: updatedTenant
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getTenantMenus = async (req, res) => {
  try {
    const tenantId = req.params.tenantId || req.query.tenantId;

    const menus = await tenantService.getMenusByTenantIdService(tenantId);
    
    return res.status(200).json({
      success: true,
      data: menus
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};