import CustomerChatbot from '../../models/CustomerChatbot.model.js';

export const findAllChatbotFaqsByTenantRepo = async (tenantId) => {
  return await CustomerChatbot.find({ tenantId }).sort({ createdAt: -1 });
};

export const findActiveChatbotFaqsByTenantRepo = async (tenantId) => {
  return await CustomerChatbot.find({ tenantId, isActive: true });
};

export const createChatbotFaqRepo = async (faqData) => {
  const newFaq = new CustomerChatbot(faqData);
  return await newFaq.save();
};

export const updateChatbotFaqRepo = async (faqId, updateData) => {
  return await CustomerChatbot.findByIdAndUpdate(faqId, updateData, { new: true });
};

export const deleteChatbotFaqRepo = async (faqId) => {
  return await CustomerChatbot.findByIdAndDelete(faqId);
};