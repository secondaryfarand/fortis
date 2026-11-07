import express from 'express';
import * as mbaController from '../features/mbarecommendation/mba.controller.js';
import { getAiBusinessInsight } from '../features/insightAdvice/insight.controller.js';


const mbaRouter = express.Router();

// Endpoint: GET /api/v1/insights/market-basket
// mbaRouter.get('/market-basket', mbaController.getMarketBasketInsights);
mbaRouter.get('/market-basket/:tenantId', mbaController.getMarketBasketInsights);

// new ai advisor
mbaRouter.post('/:tenantId/ai-advisor', getAiBusinessInsight);

export default mbaRouter;



