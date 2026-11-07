import * as orderRepo from './order.repository.js';
import * as transactionRepo from '../transaction/transaction.repository.js'; 

export const createNewOrderService = async (bodyData) => {
  if (!bodyData.items || bodyData.items.length === 0) {
    throw new Error("Pesanan tidak boleh kosong.");
  }
  if (!bodyData.tableNumber) {
    throw new Error("Nomor meja wajib diisi.");
  }

  return await orderRepo.createOrderRepo(bodyData);
};

export const getOrdersByTenantService = async (tenantId) => {
  return await orderRepo.findOrdersByTenantRepo(tenantId);
};

export const updateOrderStatusService = async (orderId, paymentStatus) => {
  const updatedOrder = await orderRepo.updateOrderStatusRepo(orderId, paymentStatus);
  if (!updatedOrder) {
    throw new Error("Pesanan tidak ditemukan.");
  }

  if (paymentStatus === 'paid') {
    try {
      await transactionRepo.createTransactionFromOrderRepo(updatedOrder);
    } catch (err) {
      console.error("Gagal merekam data ke Transaction collection:", err);
    }
  }

  return updatedOrder;
};