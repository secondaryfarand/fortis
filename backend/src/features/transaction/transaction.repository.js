import Transaction from '../../models/Transaction.model.js';

export const createTransactionFromOrderRepo = async (orderData) => {
  // itung dayOfWeek (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  const transactionPayload = {
    tenantId: orderData.tenantId,
    items: orderData.items.map(item => ({
      menuItemId: item.menuId, 
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    })),
    totalAmount: orderData.totalPrice,
    saleDate: currentDate,
    isCeremonyDay: false, // inget nntii sesauaiin klk ada logic hari raya/upacara adat Bali janlup
    dayOfWeek: dayOfWeek
  };

  const newTransaction = new Transaction(transactionPayload);
  return await newTransaction.save();
};