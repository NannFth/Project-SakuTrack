const pool = require('../config/database');

// Ambil Data
const getTransactions = async (req, res) => {
    try {
        const { uid } = req.user;

        const [rows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = (SELECT id FROM users WHERE firebase_uid = ?) ORDER BY created_at DESC',
            [uid]
        );

        const trendMap = rows.reduce((acc, tx) => {
            const d = new Date(tx.date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`; 

            if (!acc[dateStr]) acc[dateStr] = { income: 0, expense: 0 };
            
            if (tx.type === 'income') acc[dateStr].income += parseFloat(tx.amount);
            else acc[dateStr].expense += parseFloat(tx.amount);
            
            return acc;
        }, {});

        // Grafik
        const labels = Object.keys(trendMap).sort(); 
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
            message: 'Error server',
            error: error.message 
        });
    }
};

// Tambah Transaksi
const addTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;
        const { uid } = req.user;

        if (!amount || !type || !category || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Data tidak lengkap' 
            });
        }

        const [user] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        const userId = user[0].id;

        // Simpan Data
        await pool.execute(
            'INSERT INTO transactions (user_id, amount, type, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, amount, type, category, description || '', date]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Berhasil ditambah' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal tambah',
            error: error.message 
        });
    }
};

// Update Transaksi
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, description, date } = req.body;
        const { uid } = req.user;

        // Update Database
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
                message: 'Data tidak ditemukan' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Berhasil update' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal update',
            error: error.message 
        });
    }
};

// Hapus Transaksi
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        // Hapus Data
        const [result] = await pool.execute(
            'DELETE FROM transactions WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)',
            [id, uid]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data tidak ditemukan' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Berhasil hapus' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal hapus',
            error: error.message 
        });
    }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };