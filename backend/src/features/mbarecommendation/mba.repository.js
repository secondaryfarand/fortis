import MBARecommendation from '../../models/MBARecommendation.model.js';

export const findMBARecommendationsByTenant = async (tenantId) => {
  try {
    const recommendations = await MBARecommendation.find({ tenantId }).sort({ confidence: -1 });
    return recommendations;
  } catch (error) {
    throw new Error(`Database Error (findMBARecommendationsByTenant): ${error.message}`);
  }
};