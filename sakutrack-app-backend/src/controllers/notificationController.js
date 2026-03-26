const pool = require('../config/database');

// Ambil notifikasi
const getNotifications = async (req, res) => {
    try {
        const { uid } = req.user;

        // Cari user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const userId = userRows[0].id;

        // Urutan notif
        const [notifs] = await pool.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        const unreadCount = notifs.filter(n => n.is_read === 0).length;

        res.status(200).json({
            success: true,
            data: notifs,
            unreadCount
        });

    } catch (error) {
        console.error("Error getNotifications:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Notif terbaca
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (userRows.length === 0) return res.status(404).json({ success: false });

        const userId = userRows[0].id;
        const io = req.app.get('socketio');

        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (io) io.to(String(userId)).emit('notifications_updated');

        res.status(200).json({ success: true, message: 'Notif dibaca' });
    } catch (error) {
        console.error("Error markAsRead:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Semua notif terbaca
const markAllAsRead = async (req, res) => {
    try {
        const { uid } = req.user;

        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (userRows.length === 0) return res.status(404).json({ success: false });

        const userId = userRows[0].id;
        const io = req.app.get('socketio');

        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [userId]
        );

        if (io) io.to(String(userId)).emit('notifications_updated');

        res.status(200).json({ success: true, message: 'Semua notif dibaca' });
    } catch (error) {
        console.error("Error markAllAsRead:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};