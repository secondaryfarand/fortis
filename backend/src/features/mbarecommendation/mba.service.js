import * as mbaRepo from './mba.repository.js';

export const getMarketBasketInsightsService = async (tenantId) => {
  try {
    const recommendations = await mbaRepo.findMBARecommendationsByTenant(tenantId);
    return recommendations;
  } catch (error) {
    throw new Error(`Service Error (getMarketBasketInsightsService): ${error.message}`);
  }
};