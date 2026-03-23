const pool = require('../config/database');

const getDashboardData = async (req, res) => {
    try {
        const { uid } = req.user;
        const { month, year } = req.query;

        // Ambil Data
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE firebase_uid = ?',
            [uid]
        );

        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data pengguna tidak ditemukan'
            });
        }

        const userId = userRows[0].id;

        const [transactions] = await pool.execute(
            `SELECT amount, type, category, date FROM transactions 
             WHERE user_id = ? 
             AND MONTH(date) = ? 
             AND YEAR(date) = ?`,
            [userId, month, year]
        );

        // Ambil Tabungan
        const [savings] = await pool.execute(
            'SELECT * FROM savings WHERE user_id = ?',
            [userId]
        );

        const activeSavings = savings.filter(item => {
            const current = parseFloat(item.current_amount || item.currentAmount || 0);
            const target = parseFloat(item.target_amount || item.targetAmount || 0);
            return current < target;
        });

        let totalIncome = 0;
        let totalExpense = 0;
        let expenseCategories = {};

        for (const item of transactions) {
            const amount = parseFloat(item.amount);
            if (item.type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
                if (!expenseCategories[item.category]) {
                    expenseCategories[item.category] = 0;
                }
                expenseCategories[item.category] += amount;
            }
        }

        res.status(200).json({
            success: true,
            message: 'Data dashboard berhasil diambil',
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                expenseBreakdown: expenseCategories,
                activeGoals: activeSavings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

module.exports = { getDashboardData };