const pool = require('../config/database');
const { sendPushNotification } = require('../services/notificationService');

// Ambil Data
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

// Nambah Tabungan
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

// Update Tabungan
const updateSaving = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, targetAmount, currentAmount, targetDate } = req.body;
        const { uid } = req.user;

        const [user] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        const userId = user[0].id;
        const io = req.app.get('socketio');

        // Perbandingan dan hitung estimasi
        const [existingData] = await pool.execute(
            'SELECT current_amount, target_amount, name, created_at FROM savings WHERE id = ? AND user_id = ?', 
            [id, userId]
        );

        if (existingData.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tabungan tidak ditemukan' });
        }
        const [result] = await pool.execute(
            `UPDATE savings SET 
                name = COALESCE(?, name), 
                target_amount = COALESCE(?, target_amount), 
                current_amount = COALESCE(?, current_amount), 
                target_date = COALESCE(?, target_date) 
            WHERE id = ? AND user_id = ?`,
            [name, targetAmount, currentAmount, targetDate, id, userId]
        );

        if (currentAmount !== undefined) {
            const prevAmount = Number(existingData[0].current_amount);
            const target = Number(targetAmount || existingData[0].target_amount);
            const newAmount = Number(currentAmount);
            const savingName = name || existingData[0].name;
            const createdAt = new Date(existingData[0].created_at);
            const now = new Date();

            // Target Tercapai
            if (prevAmount < target && newAmount >= target) {
                const title = '🏆 Pencapaian Target Tabungan';
                const message = `Selamat! Target tabungan Anda "${savingName}" telah berhasil tercapai sepenuhnya. Kedisiplinan Anda dalam menabung adalah langkah nyata menuju kebebasan finansial.`;
                
                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, 0)`,
                    [userId, title, message, 'success']
                );

                if (io) io.to(String(userId)).emit('new_notification', { title, message, type: 'success' });
                sendPushNotification(userId, title, message);
            } 
            
            // Hampir Tercapai
            else if (newAmount >= (target * 0.9) && prevAmount < (target * 0.9) && newAmount < target) {
                const diffTime = Math.abs(now - createdAt);
                const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
                const dailyRate = newAmount / daysPassed;
                const remainingAmount = target - newAmount;
                
                let estimationText = "";
                if (dailyRate > 0) {
                    const daysLeft = Math.ceil(remainingAmount / dailyRate);
                    if (daysLeft > 30) {
                        estimationText = ` Berdasarkan progres Anda, target ini diperkirakan akan tercapai dalam ${Math.ceil(daysLeft / 30)} bulan lagi.`;
                    } else {
                        estimationText = ` Berdasarkan progres Anda, target ini diperkirakan akan tercapai dalam ${daysLeft} hari ke depan.`;
                    }
                }

                const title = '✨ Target Tabungan Segera Tercapai!';
                const message = `Luar biasa! Tabungan "${savingName}" Anda sudah mencapai 90%. Sedikit lagi usaha Anda akan membuahkan hasil.${estimationText}`;

                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) VALUES (?, ?, ?, ?, 0)`,
                    [userId, title, message, 'info']
                );

                if (io) io.to(String(userId)).emit('new_notification', { title, message, type: 'info' });
                sendPushNotification(userId, title, message);
            }
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

// Hapus Tabungan
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