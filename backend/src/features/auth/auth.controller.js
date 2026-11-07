import * as authService from './auth.service.js';

export const register = async (req, res) => {
  try {
const newUser = await authService.registerUserService(req.body);    
    return res.status(201).json({
      success: true,
      message: "Registrasi dan login otomatis berhasil.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenantId
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authData = await authService.loginUserService(email, password);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: authData
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};