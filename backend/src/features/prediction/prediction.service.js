import * as predictionRepo from './prediction.repository.js';

/**
 * Service untuk menghitung prediksi penjualan menu dan konversi ke bahan baku mentah (BOM)
 * Menggunakan parameter AI hasil training offline (Python) dari koleksi aiparameters via repository.
 */
export const calculateTenantStockPrediction = async (tenantId, targetDateStr, isCeremonyDayQuery = false) => {
  // 1. Ambil seluruh data pendukung secara terpusat melalui repository
  const transactions = await predictionRepo.findTransactionsByTenant(tenantId);
  const aiParams = await predictionRepo.findAIParametersByTenant(tenantId);
  const menuItems = await predictionRepo.findMenuItemsByTenant(tenantId);

  // Nilai default jika parameter AI hasil training Python belum tersedia di database
  const coefficients = aiParams && aiParams.stockCoefficients ? aiParams.stockCoefficients : {
    baseMultiplier: 1.05,
    ceremonyMultiplier: 1.25,
    dayOfWeekWeights: [1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.3] // Senin - Minggu
  };

  // 2. Tentukan hari dari target tanggal (0 = Minggu, 6 = Sabtu)
  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
  const dayOfWeek = targetDate.getDay();
  const dayWeight = coefficients.dayOfWeekWeights[dayOfWeek] || 1.0;

  // Tentukan apakah hari target merupakan hari upacara/hari raya di Bali
  const isCeremony = isCeremonyDayQuery; 
  const ceremonyMultiplier = isCeremony ? coefficients.ceremonyMultiplier : 1.0;

  // 3. Hitung total penjualan historis per menu dari data transaksi
  const historicalSalesCount = {};
  transactions.forEach(trx => {
    trx.items.forEach(item => {
      // Ambil ID menu dengan aman (mendukung populate atau raw ObjectId)
      const menuId = item.menuItemId && item.menuItemId._id 
        ? item.menuItemId._id.toString() 
        : item.menuItemId.toString();
      
      historicalSalesCount[menuId] = (historicalSalesCount[menuId] || 0) + item.quantity;
    });
  });

  const totalDaysRecorded = Math.max(transactions.length, 1);
  const menuDemandPredictions = {};

  // 4. Hitung Prediksi Permintaan Porsi per Menu menggunakan model bobot AI
  menuItems.forEach(menu => {
    const menuId = menu._id.toString();
    const totalSold = historicalSalesCount[menuId] || 5; // Fallback default jika menu baru
    const avgDailySold = totalSold / totalDaysRecorded;
    
    // Rumus AI Hybrid: Rata-rata harian * Bobot Hari * Base Multiplier * Ceremony Multiplier
    const predictedPortions = Math.ceil(
      avgDailySold * dayWeight * coefficients.baseMultiplier * ceremonyMultiplier
    );
    
    menuDemandPredictions[menuId] = {
      menuName: menu.name,
      predictedPortions: Math.max(predictedPortions, 1),
      ingredients: menu.ingredients
    };
  });

  // 5. Konversi Porsi Menu Menjadi Total Kebutuhan Bahan Baku Mentah (BOM)
  const rawIngredientNeeds = {};

  Object.values(menuDemandPredictions).forEach(prediction => {
    prediction.ingredients.forEach(ing => {
      const ingName = ing.ingredientName;
      const totalRequired = ing.quantityRequiredPerPortion * prediction.predictedPortions;

      if (!rawIngredientNeeds[ingName]) {
        rawIngredientNeeds[ingName] = {
          ingredientName: ingName,
          totalQuantityNeeded: 0
        };
      }
      rawIngredientNeeds[ingName].totalQuantityNeeded += totalRequired;
    });
  });

  // Bulatkan hasil akhir kebutuhan bahan baku agar rapi
  Object.keys(rawIngredientNeeds).forEach(key => {
    rawIngredientNeeds[key].totalQuantityNeeded = parseFloat(
      rawIngredientNeeds[key].totalQuantityNeeded.toFixed(2)
    );
  });

  return {
    tenantId,
    targetDate: targetDate.toISOString().split('T')[0],
    dayOfWeek,
    isCeremonyDay: isCeremony,
    appliedCoefficients: coefficients,
    menuPredictions: Object.values(menuDemandPredictions),
    rawMaterialShoppingList: Object.values(rawIngredientNeeds)
  };
};