const pool = require('../config/database');

// Fetch Data
const getSavings = async (req, res) => {
    try {
        const { uid } = req.user;

        const [rows] = await pool.execute(
            'SELECT * FROM savings WHERE user_id = (SELECT id FROM users WHERE firebase_uid = ?)',
            [uid]
        );

        res.status(200).json({
            success: true,
            message: 'Data tabungan berhasil diambil',
            data: rows
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengambil data tabungan',
            error: error.message 
        });
    }
};

// Add Data
const addSaving = async (req, res) => {
    try {
        const { name, targetAmount, currentAmount, targetDate } = req.body;
        const { uid } = req.user;

        if (!name || !targetAmount || !targetDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Informasi tabungan tidak lengkap' 
            });
        }

        const [user] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        const userId = user[0].id;

        await pool.execute(
            'INSERT INTO savings (user_id, name, target_amount, current_amount, target_date) VALUES (?, ?, ?, ?, ?)',
            [userId, name, targetAmount, currentAmount || 0, targetDate]
        );

        res.status(201).json({
            success: true,
            message: 'Target tabungan berhasil dibuat'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal menambahkan data tabungan',
            error: error.message 
        });
    }
};

// Update Data
const updateSaving = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, targetAmount, currentAmount, targetDate } = req.body;
        const { uid } = req.user;

        const [result] = await pool.execute(
            `UPDATE savings SET 
                name = COALESCE(?, name), 
                target_amount = COALESCE(?, target_amount), 
                current_amount = COALESCE(?, current_amount), 
                target_date = COALESCE(?, target_date) 
            WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)`,
            [name, targetAmount, currentAmount, targetDate, id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data tabungan tidak ditemukan atau akses ditolak' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data tabungan berhasil diperbarui'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal memperbarui data tabungan',
            error: error.message 
        });
    }
};

// Delete Data
const deleteSaving = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const [result] = await pool.execute(
            'DELETE FROM savings WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)',
            [id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data tidak ditemukan untuk dihapus' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data tabungan berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal menghapus data tabungan',
            error: error.message 
        });
    }
};

module.exports = { getSavings, addSaving, updateSaving, deleteSaving };