import * as chatbotService from './customerChatbot.service.js';

export const askCustomerChatbot = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { question } = req.body;

    const result = await chatbotService.processCustomerChatbotService(tenantId, question);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getTenantChatbotFaqs = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const faqs = await chatbotService.getTenantChatbotFaqsService(tenantId);
    return res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createCustomerChatbotFaq = async (req, res) => {
  try {
    const newFaq = await chatbotService.addCustomerChatbotFaqService(req.body);
    return res.status(201).json({
      success: true,
      message: "Data FAQ chatbot berhasil ditambahkan.",
      data: newFaq
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCustomerChatbotFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const updatedFaq = await chatbotService.updateCustomerChatbotFaqService(faqId, req.body);
    return res.status(200).json({
      success: true,
      message: "Data FAQ chatbot berhasil diperbarui.",
      data: updatedFaq
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCustomerChatbotFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    await chatbotService.deleteCustomerChatbotFaqService(faqId);
    return res.status(200).json({
      success: true,
      message: "Data FAQ chatbot berhasil dihapus."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};