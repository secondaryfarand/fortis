import express from 'express';
import * as orderController from '../features/order/order.controller.js';

const router = express.Router();

router.post('/', orderController.createOrder);                 
router.get('/:tenantId', orderController.getOrders);           
router.patch('/:orderId/status', orderController.updateOrderStatus); 

export default router;