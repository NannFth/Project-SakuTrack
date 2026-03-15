const { users } = require('../config/database');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'Akses ditolak, silakan login terlebih dahulu' 
        });
    }

    const userId = parseInt(authHeader);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(403).json({ 
            success: false, 
            message: 'Sesi tidak valid atau user tidak ditemukan' 
        });
    }

    req.user = user;
    
    next();
};

module.exports = authMiddleware;