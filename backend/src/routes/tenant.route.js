import express from 'express';
import * as tenantController from '../features/tenant/tenant.controller.js';

const router = express.Router();

router.get('/', tenantController.getAllTenants);
router.get('/:tenantId', tenantController.getTenantInfo);
router.post('/', tenantController.createNewTenant);
router.put('/:tenantId', tenantController.updateTenantInfo);

// menu
router.get('/:tenantId/menus', tenantController.getTenantMenus);
router.get('/menus', tenantController.getTenantMenus);

export default router;