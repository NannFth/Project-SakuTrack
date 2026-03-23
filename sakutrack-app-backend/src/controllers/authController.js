const pool = require('../config/database');

// Register
const register = async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { name } = req.body;

        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pengguna sudah terdaftar dalam sistem' 
            });
        }

        // Insert user
        const [result] = await pool.execute(
            'INSERT INTO users (firebase_uid, email, name) VALUES (?, ?, ?)',
            [uid, email, name || 'User']
        );

        res.status(201).json({ 
            success: true, 
            message: 'Pendaftaran pengguna berhasil dilakukan',
            data: { id: result.insertId, email, name } 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server',
            error: error.message 
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { uid } = req.user;

        // Fetch user
        const [rows] = await pool.execute(
            'SELECT id, email, name FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data pengguna tidak ditemukan' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Proses masuk berhasil',
            data: rows[0] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server',
            error: error.message 
        });
    }
};

// Profile
const getProfile = async (req, res) => {
    try {
        const { uid } = req.user;

        const [rows] = await pool.execute(
            'SELECT id, email, name FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Profil tidak ditemukan' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Data profil berhasil diambil',
            data: rows[0] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server',
            error: error.message 
        });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { uid } = req.user;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nama tidak boleh kosong' 
            });
        }

        const [result] = await pool.execute(
            'UPDATE users SET name = ? WHERE firebase_uid = ?',
            [name, uid]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Profil berhasil diperbarui' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server',
            error: error.message 
        });
    }
};

module.exports = { register, login, getProfile, updateProfile };