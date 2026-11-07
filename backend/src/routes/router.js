import { Router } from 'express';
import authRoute from './auth.route.js';
import predictionRoute from './prediction.route.js';
import mbaRoute from './mba.route.js';
import tenantRoute from './tenant.route.js';
import orderRoute from './order.route.js';
import customerChatbotRoutes from './customerChatbot.route.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Subsystem router operational is connected.' });
});

router.use('/auth', authRoute);
router.use('/predictions', predictionRoute);
router.use('/insights', mbaRoute);
router.use('/tenants', tenantRoute);
router.use('/orders', orderRoute);
router.use('/customer-chatbot', customerChatbotRoutes);

export default router;

