import { Router } from 'express';
// import predictionController from '../features/prediction/prediction.controller.js';
import * as predictionController from '../features/prediction/prediction.controller.js';

const predictionRouter = Router();

/**
 * Route untuk mengambil prediksi stok kafe
 * Method: GET
 * URL: /api/predictions/:tenantId?targetDate=2026-11-10
 */
predictionRouter.get('/health', (req, res) => {
  res.status(200).json({ message: 'Subsystem router operational is connected.' });
});

predictionRouter.get('/:tenantId', predictionController.getStockPrediction);

export default predictionRouter;


