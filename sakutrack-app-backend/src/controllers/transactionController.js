const pool = require('../config/database');

// Fetch Data
const getTransactions = async (req, res) => {
    try {
        const { uid } = req.user;

        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = (SELECT id FROM users WHERE firebase_uid = ?) ORDER BY date ASC',
            [uid]
        );

        const trendMap = rows.reduce((acc, tx) => {
            const dateStr = tx.date.toISOString().split('T')[0];
            if (!acc[dateStr]) acc[dateStr] = { income: 0, expense: 0 };
            
            if (tx.type === 'income') acc[dateStr].income += parseFloat(tx.amount);
            else acc[dateStr].expense += parseFloat(tx.amount);
            
            return acc;
        }, {});

        const labels = Object.keys(trendMap);
        const incomeTrend = labels.map(t => trendMap[t].income);
        const expenseTrend = labels.map(t => trendMap[t].expense);

        res.status(200).json({
            success: true,
            message: 'Daftar transaksi berhasil diambil',
            data: rows,
            chartData: { labels, incomeTrend, expenseTrend }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server saat mengambil data transaksi',
            error: error.message 
        });
    }
};

// Add Data
const addTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;
        const { uid } = req.user;

        if (!amount || !type || !category || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Informasi transaksi tidak lengkap' 
            });
        }

        const [user] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        const userId = user[0].id;

        await pool.execute(
            'INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, amount, type, category, description || '', date]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Transaksi berhasil ditambahkan' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal menambahkan data transaksi',
            error: error.message 
        });
    }
};

// Update Data
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, description, date } = req.body;
        const { uid } = req.user;

        const [result] = await pool.execute(
            `UPDATE transactions SET 
                amount = COALESCE(?, amount), 
                type = COALESCE(?, type), 
                category = COALESCE(?, category), 
                description = COALESCE(?, description), 
                date = COALESCE(?, date) 
            WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)`,
            [amount, type, category, description, date, id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data transaksi tidak ditemukan atau akses ditolak' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Data transaksi berhasil diperbarui' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal memperbarui data transaksi',
            error: error.message 
        });
    }
};

// Delete Data
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const [result] = await pool.execute(
            'DELETE FROM transactions WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)',
            [id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data transaksi tidak ditemukan untuk dihapus' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Data transaksi berhasil dihapus' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal menghapus data transaksi',
            error: error.message 
        });
    }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };