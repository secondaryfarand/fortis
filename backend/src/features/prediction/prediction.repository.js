import Transaction from '../../models/Transaction.model.js';
import AIParameter from '../../models/AIParameter.model.js';
import MenuItem from '../../models/MenuItem.model.js';
import Tenant from '../../models/Tenant.model.js';

/**
 * Repository untuk mengambil data yang berkaitan dengan prediksi stok dari MongoDB.
 * Mengisolasi semua query database agar terpusat di sini.
 */

/**
 * Mengambil seluruh riwayat transaksi milik suatu kafe (tenant)
 * @param {String} tenantId - ID Tenant / Kafe
 */
export const findTransactionsByTenant = async (tenantId) => {
  try {
    const transactions = await Transaction.find({ tenantId })
      .populate('items.menuItemId')
      .sort({ saleDate: -1 });
    return transactions;
  } catch (error) {
    throw new Error(`Database Error (findTransactionsByTenant): ${error.message}`);
  }
};

/**
 * Mengambil parameter/bobot AI dinamis milik suatu kafe
 * @param {String} tenantId - ID Tenant / Kafe
 */
export const findAIParametersByTenant = async (tenantId) => {
  try {
    const aiParams = await AIParameter.findOne({ tenantId });
    return aiParams;
  } catch (error) {
    throw new Error(`Database Error (findAIParametersByTenant): ${error.message}`);
  }
};

/**
 * Mengambil daftar menu dan resep bahan baku (BOM) milik suatu kafe
 * @param {String} tenantId - ID Tenant / Kafe
 */
export const findMenuItemsByTenant = async (tenantId) => {
  try {
    const menuItems = await MenuItem.find({ tenantId });
    return menuItems;
  } catch (error) {
    throw new Error(`Database Error (findMenuItemsByTenant): ${error.message}`);
  }
};