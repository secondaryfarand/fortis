export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    // Untuk tahap awal, role bisa dikirim via header custom (misal: 'x-user-role') 
    // atau dari payload token nanti.
    const userRole = req.headers['x-user-role'] || 'customer';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak: Anda tidak memiliki hak akses untuk fitur ini."
      });
    }

    next();
  };
};