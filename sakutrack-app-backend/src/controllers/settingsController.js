const pool = require('../config/database');

const getSettings = async (req, res) => {
    try {
        const { uid } = req.user; 

        const [userRows] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        if (userRows.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        
        const userId = userRows[0].id;

        const [settings] = await pool.execute('SELECT * FROM settings WHERE user_id = ?', [userId]);
        
        if (settings.length > 0) {
            return res.json({ success: true, data: settings[0] });
        } else {
            return res.json({ 
                success: true, 
                data: { needs_ratio: 50, wants_ratio: 30, savings_ratio: 20, daily_limit_percentage: 80 } 
            });
        }
    } catch (error) {
        console.error('Error get settings:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { uid } = req.user;
        const { needs_ratio, wants_ratio, savings_ratio, daily_limit_percentage } = req.body;

        const [userRows] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        if (userRows.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        
        const userId = userRows[0].id;

        const [existing] = await pool.execute('SELECT id FROM settings WHERE user_id = ?', [userId]);

        if (existing.length > 0) {
            await pool.execute(
                'UPDATE settings SET needs_ratio = ?, wants_ratio = ?, savings_ratio = ?, daily_limit_percentage = ? WHERE user_id = ?',
                [needs_ratio, wants_ratio, savings_ratio, daily_limit_percentage, userId]
            );
        } else {
            await pool.execute(
                'INSERT INTO settings (user_id, needs_ratio, wants_ratio, savings_ratio, daily_limit_percentage) VALUES (?, ?, ?, ?, ?)',
                [userId, needs_ratio, wants_ratio, savings_ratio, daily_limit_percentage]
            );
        }

        res.json({ success: true, message: 'Pengaturan berhasil disimpan ke database' });
    } catch (error) {
        console.error('Error update settings:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
};

module.exports = { getSettings, updateSettings };