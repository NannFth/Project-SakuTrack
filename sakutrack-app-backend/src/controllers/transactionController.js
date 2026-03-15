const { transactions } = require('../config/database');

// Ambil data
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const userTransactions = transactions.filter((tx) => tx.userId == userId);

    const sortedData = [...userTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const trendMap = sortedData.reduce((acc, tx) => {
      const tgl = tx.date;
      if (!acc[tgl]) acc[tgl] = { income: 0, expense: 0 };
      
      if (tx.type === 'income') acc[tgl].income += tx.amount;
      else acc[tgl].expense += tx.amount;
      
      return acc;
    }, {});

    const labels = Object.keys(trendMap);
    const incomeTrend = labels.map(t => trendMap[t].income);
    const expenseTrend = labels.map(t => trendMap[t].expense);

    res.json({
      success: true,
      message: 'Daftar transaksi berhasil diambil',
      data: userTransactions,
      chartData: { labels, incomeTrend, expenseTrend }
    });
  } catch (error) {
    console.error(`[Error] getTransactions: ${error.message}`);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Tambah transaksi
const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category || !description || !date) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const newTransaction = {
      id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
      userId: req.user.id,
      amount: Number(amount),
      type,
      category,
      description,
      date
    };

    transactions.push(newTransaction);
    res.status(201).json({ 
      success: true, 
      message: 'Transaksi berhasil ditambahkan', 
      data: newTransaction 
    });
  } catch (error) {
    console.error(`[Error] addTransaction: ${error.message}`);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Update transaksi
const updateTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    const { amount, type, category, description, date } = req.body;
    
    const idx = transactions.findIndex(tx => tx.id === id && tx.userId == userId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    transactions[idx] = {
      ...transactions[idx],
      amount: amount ? Number(amount) : transactions[idx].amount,
      type: type || transactions[idx].type,
      category: category || transactions[idx].category,
      description: description || transactions[idx].description,
      date: date || transactions[idx].date
    };

    res.json({ 
      success: true, 
      message: 'Transaksi berhasil diperbarui', 
      data: transactions[idx] 
    });
  } catch (error) {
    console.error(`[Error] updateTransaction: ${error.message}`);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Hapus transaksi
const deleteTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    const idx = transactions.findIndex(tx => tx.id === id && tx.userId == userId);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    transactions.splice(idx, 1);
    res.json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error(`[Error] deleteTransaction: ${error.message}`);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };