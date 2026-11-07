import Order from '../../models/Order.model.js';

export const createOrderRepo = async (orderData) => {
  const newOrder = new Order(orderData);
  return await newOrder.save();
};

export const findOrdersByTenantRepo = async (tenantId) => {
  let query = {};
  if (tenantId) {
    query.tenantId = tenantId;
  }
  return await Order.find(query).sort({ createdAt: -1 });
};

export const updateOrderStatusRepo = async (orderId, paymentStatus) => {
  return await Order.findByIdAndUpdate(
    orderId, 
    { paymentStatus }, 
    { new: true }
  );
};