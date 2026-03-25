const pool = require('../config/database');
const { sendPushNotification } = require('../services/notificationService');

// Ambil Data
const getTransactions = async (req, res) => {
    try {
        const { uid } = req.user;

        const [rows] = await pool.execute(
            'SELECT *, IFNULL(jenis, "") as jenis FROM transactions WHERE user_id = (SELECT id FROM users WHERE firebase_uid = ?) ORDER BY created_at DESC',
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
        const { amount, type, category, description, date, jenis } = req.body;
        const finalJenis = type === "expense" ? jenis : null;
        const { uid } = req.user;

        if (!amount || !type || !category || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Data tidak lengkap' 
            });
        }

        const [user] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
        if (user.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        const userId = user[0].id;

        const io = req.app.get('socketio');

        // Simpan Data
        await pool.execute(
            'INSERT INTO transactions (user_id, amount, type, category, description, date, jenis) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, amount, type, category, description || '', date, finalJenis]
        );

        // Notifikasi Pengeluaran
        if (type === 'expense') {
            const d = new Date(date);
            const currentMonth = d.getMonth() + 1;
            const currentYear = d.getFullYear();
            const [stats] = await pool.execute(
                `SELECT 
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense
                 FROM transactions 
                 WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
                [userId, currentMonth, currentYear]
            );

            const totalIncome = Number(stats[0].totalIncome || 0);
            const totalExpense = Number(stats[0].totalExpense || 0);
            const expenseAmount = Number(amount);

            if (totalIncome > 0) {
                // Peringatan Bulanan
                const percentage = (totalExpense / totalIncome) * 100;
                const previousExpense = totalExpense - expenseAmount;
                const previousPercentage = (previousExpense / totalIncome) * 100;

                if (percentage >= 90 && previousPercentage < 90) {
                    const title = '⚠️ Ambang Batas Pengeluaran Bulanan';
                    const message = `Perhatian, total pengeluaran Anda telah mencapai ${percentage.toFixed(0)}% dari pemasukan bulan ini. Mohon pertimbangkan kembali prioritas belanja Anda agar tetap sesuai rencana.`;
                    
                    await pool.execute(
                        `INSERT INTO notifications (user_id, title, message, type, is_read) 
                         VALUES (?, ?, ?, ?, 0)`,
                        [userId, title, message, 'alert']
                    );

                    if (io) io.to(`user_${userId}`).emit('new_notification', { title, message, type: 'alert' });
                    sendPushNotification(userId, title, message);
                }

                // Peringatan Batas Aman Harian
                const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
                const dailyBudgetLimit = totalIncome / daysInMonth;

                const [dailyStats] = await pool.execute(
                    `SELECT SUM(amount) as dailyExpense 
                     FROM transactions 
                     WHERE user_id = ? AND type = 'expense' AND DATE(date) = DATE(?)`,
                    [userId, date]
                );
                
                const dailyExpense = Number(dailyStats[0].dailyExpense || 0);
                const previousDailyExpense = dailyExpense - expenseAmount;

                if (dailyExpense >= (0.8 * dailyBudgetLimit) && previousDailyExpense < (0.8 * dailyBudgetLimit)) {
                    const title = '📢 Batas Aman Anggaran Harian';
                    const message = 'Pengeluaran Anda hari ini hampir mencapai batas harian yang disarankan. Mohon kelola sisa anggaran hari ini dengan lebih bijak.';
                    
                    await pool.execute(
                        `INSERT INTO notifications (user_id, title, message, type, is_read) 
                         VALUES (?, ?, ?, ?, 0)`,
                        [userId, title, message, 'warning']
                    );

                    if (io) io.to(`user_${userId}`).emit('new_notification', { title, message, type: 'warning' });
                    sendPushNotification(userId, title, message);
                }
            }

            // Peringatan Pengeluaran Abnormal
            const [avgStats] = await pool.execute(
                `SELECT AVG(amount) as avgExpense 
                 FROM transactions 
                 WHERE user_id = ? AND type = 'expense' AND id != LAST_INSERT_ID()`,
                [userId]
            );
            
            const avgExpense = Number(avgStats[0].avgExpense || 0);
            
            if (avgExpense > 0 && expenseAmount >= 100000 && expenseAmount > (avgExpense * 3)) {
                const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(expenseAmount);
                const title = '🚨 Peringatan Transaksi Tidak Biasa';
                const message = `Transaksi sebesar ${formattedAmount} telah dicatat. Nilai ini berada di atas rata-rata pengeluaran normal Anda. Harap tinjau kembali untuk memastikan keakuratan data.`;
                
                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) 
                     VALUES (?, ?, ?, ?, 0)`,
                    [userId, title, message, 'alert']
                );

                if (io) io.to(`user_${userId}`).emit('new_notification', { title, message, type: 'alert' });
                sendPushNotification(userId, title, message);
            }

            // Peringatan Kategori Bocor
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const yearOfLastMonth = currentMonth === 1 ? currentYear - 1 : currentYear;

            const [currentCatStats] = await pool.execute(
                `SELECT SUM(amount) as total 
                 FROM transactions 
                 WHERE user_id = ? AND type = 'expense' AND category = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
                [userId, category, currentMonth, currentYear]
            );
            const currentCatTotal = Number(currentCatStats[0].total || 0);
            const previousCatTotal = currentCatTotal - expenseAmount;

            const [lastCatStats] = await pool.execute(
                `SELECT SUM(amount) as total 
                 FROM transactions 
                 WHERE user_id = ? AND type = 'expense' AND category = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
                [userId, category, lastMonth, yearOfLastMonth]
            );
            const lastCatTotal = Number(lastCatStats[0].total || 0);

            if (lastCatTotal >= 100000 && previousCatTotal <= lastCatTotal && currentCatTotal > lastCatTotal) {
                const title = '📉 Analisis Lonjakan Kategori';
                const message = `Total pengeluaran pada kategori "${category}" telah melampaui jumlah bulan lalu. Mohon evaluasi kembali alokasi anggaran pada kategori ini.`;
                
                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) 
                     VALUES (?, ?, ?, ?, 0)`,
                    [userId, title, message, 'warning']
                );

                if (io) io.to(`user_${userId}`).emit('new_notification', { title, message, type: 'warning' });
                sendPushNotification(userId, title, message);
            }
        }

        // Streak Pencatatan
        const [todayTxs] = await pool.execute(
            `SELECT COUNT(id) as count FROM transactions WHERE user_id = ? AND DATE(date) = DATE(?)`,
            [userId, date]
        );

        if (todayTxs[0].count === 1) {
            const [pastDates] = await pool.execute(
                `SELECT DISTINCT DATE(date) as logDate 
                 FROM transactions 
                 WHERE user_id = ? AND DATE(date) <= DATE(?) 
                 ORDER BY logDate DESC LIMIT 31`,
                [userId, date]
            );

            let streak = 0;
            let targetDateStr = new Date(date).toISOString().split('T')[0];
            let currentDateObj = new Date(targetDateStr);
            currentDateObj.setHours(0, 0, 0, 0);

            for (let i = 0; i < pastDates.length; i++) {
                let logDateStr = new Date(pastDates[i].logDate).toISOString().split('T')[0];
                let logDateObj = new Date(logDateStr);
                logDateObj.setHours(0, 0, 0, 0);
                
                let expectedDate = new Date(currentDateObj);
                expectedDate.setDate(expectedDate.getDate() - streak);
                expectedDate.setHours(0, 0, 0, 0);
                
                if (logDateObj.getTime() === expectedDate.getTime()) {
                    streak++;
                } else {
                    break;
                }
            }

            if (streak === 3 || streak === 7 || streak === 30) {
                let milestoneStr = streak === 30 ? '1 bulan' : `${streak} hari`;
                const title = '⭐ Apresiasi Konsistensi Keuangan';
                const message = `Luar biasa! Anda telah konsisten mencatat aktivitas keuangan selama ${milestoneStr} berturut-turut. Pertahankan disiplin ini demi kesehatan finansial yang lebih baik.`;
                
                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) 
                     VALUES (?, ?, ?, ?, 0)`,
                    [userId, title, message, 'success']
                );

                if (io) io.to(`user_${userId}`).emit('new_notification', { title, message, type: 'success' });
                sendPushNotification(userId, title, message);
            }
        }

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
        const { amount, type, category, description, date, jenis } = req.body;
        const { uid } = req.user;

        // Update Database
        const [result] = await pool.execute(
            `UPDATE transactions SET 
                amount = COALESCE(?, amount), 
                type = COALESCE(?, type), 
                category = COALESCE(?, category), 
                description = COALESCE(?, description), 
                date = COALESCE(?, date),
                jenis = COALESCE(?, jenis)
            WHERE id = ? AND user_id = (SELECT id FROM users WHERE firebase_uid = ?)`,
            [amount, type, category, description, date, jenis, id, uid]
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