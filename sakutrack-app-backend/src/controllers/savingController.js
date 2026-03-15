const { savings } = require('../config/database');

// Ambil data
const getSavings = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = savings.filter(s => s.userId === userId);

        res.json({
            success: true,
            message: 'Data tabungan berhasil diambil',
            data
        });
    } catch (error) {
        console.error(`[Error] getSavings: ${error.message}`);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

// Tambah tabungan
const addSaving = async (req, res) => {
    try {
        const { name, targetAmount, currentAmount, targetDate } = req.body;

        if (!name || !targetAmount || currentAmount === undefined || !targetDate) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        const newSaving = {
            id: savings.length ? savings[savings.length - 1].id + 1 : 1,
            userId: req.user.id,
            name,
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount),
            targetDate
        };

        savings.push(newSaving);
        res.status(201).json({
            success: true,
            message: 'Target tabungan berhasil dibuat',
            data: newSaving
        });
    } catch (error) {
        console.error(`[Error] addSaving: ${error.message}`);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data tabungan' });
    }
};

// Update tabungan
const updateSaving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, targetAmount, currentAmount, targetDate } = req.body;

        const index = savings.findIndex(s => s.id === id && s.userId === req.user.id);

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Data tabungan tidak ditemukan' });
        }

        savings[index] = {
            ...savings[index],
            name: name || savings[index].name,
            targetAmount: targetAmount ? Number(targetAmount) : savings[index].targetAmount,
            currentAmount: currentAmount !== undefined ? Number(currentAmount) : savings[index].currentAmount,
            targetDate: targetDate || savings[index].targetDate
        };

        res.json({ 
            success: true, 
            message: 'Data tabungan berhasil diperbarui', 
            data: savings[index] 
        });
    } catch (error) {
        console.error(`[Error] updateSaving: ${error.message}`);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data' });
    }
};

// Hapus tabungan
const deleteSaving = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = savings.findIndex(s => s.id === id && s.userId === req.user.id);

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }

        savings.splice(index, 1);
        res.json({ success: true, message: 'Data tabungan berhasil dihapus' });
    } catch (error) {
        console.error(`[Error] deleteSaving: ${error.message}`);
        res.status(500).json({ success: false, message: 'Gagal menghapus data' });
    }
};

module.exports = { getSavings, addSaving, updateSaving, deleteSaving };