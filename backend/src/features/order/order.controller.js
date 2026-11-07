import * as orderService from './order.service.js';

export const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createNewOrderService(req.body);
    return res.status(201).json({
      success: true,
      message: "Pesanan berhasil dikirim ke kasir.",
      data: newOrder
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const orders = await orderService.getOrdersByTenantService(tenantId);
    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body; 
    
    const updatedOrder = await orderService.updateOrderStatusService(orderId, paymentStatus);
    return res.status(200).json({
      success: true,
      message: "Status pembayaran pesanan berhasil diperbarui.",
      data: updatedOrder
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};