import express from 'express';
import * as chatbotController from '../features/customerChatbot/customerChatbot.controller.js';

const router = express.Router();

// for cust
router.post('/:tenantId/chat', chatbotController.askCustomerChatbot);
//for owner
router.get('/:tenantId', chatbotController.getTenantChatbotFaqs); 
router.post('/', chatbotController.createCustomerChatbotFaq);     
router.put('/:faqId', chatbotController.updateCustomerChatbotFaq);
router.delete('/:faqId', chatbotController.deleteCustomerChatbotFaq);


export default router;