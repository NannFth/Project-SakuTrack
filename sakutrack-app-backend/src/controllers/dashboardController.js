const { transactions, savings } = require('../config/database');

const getDashboardData = (req, res) => {
    try {
        const userId = req.user.id;

        // Ambil data 
        const userTransactions = transactions.filter(t => t.userId === userId);
        const userGoals = savings.filter(g => g.userId === userId);

        const summary = userTransactions.reduce((acc, curr) => {
            if (curr.type === 'income') {
                acc.income += curr.amount;
            } else {
                acc.expense += curr.amount;
                
                if (!acc.categories[curr.category]) {
                    acc.categories[curr.category] = 0;
                }
                acc.categories[curr.category] += curr.amount;
            }
            return acc;
        }, { income: 0, expense: 0, categories: {} });

        res.status(200).json({
            success: true,
            message: 'Data dashboard berhasil diambil',
            data: {
                totalIncome: summary.income,
                totalExpense: summary.expense,
                balance: summary.income - summary.expense,
                expenseBreakdown: summary.categories, 
                activeGoals: userGoals
            }
        });
    } catch (error) {
        console.error(`[DashboardError] getDashboardData: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server'
        });
    }
};

module.exports = { getDashboardData };