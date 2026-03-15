const { users } = require('../config/database');

//Login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi'
            });
        }

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                userId: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(`[AuthError] login: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
};

//Profil
const getProfile = async (req, res) => {
    try {
        const userId = req.headers.authorization;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Sesi tidak valid, silakan login kembali'
            });
        }

        const user = users.find(u => u.id == userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            nama: user.username
        });

    } catch (error) {
        console.error(`[AuthError] getProfile: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data profil'
        });
    }
};

module.exports = { login, getProfile };