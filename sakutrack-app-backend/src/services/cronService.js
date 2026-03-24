const cron = require('node-cron');
const pool = require('../config/database');

const startCronJobs = () => {
    // Pengingat Anggaran Pagi
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('Menjalankan pengingat anggaran pagi...');
            const [users] = await pool.execute('SELECT id FROM users');

            for (const user of users) {
                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) 
                     VALUES (?, ?, ?, ?, 0)`,
                    [
                        user.id,
                        'Pengingat Anggaran Harian',
                        'Selamat pagi. Mari mulai hari dengan bijak. Pastikan untuk memantau batas anggaran pengeluaran harian Anda agar kondisi keuangan tetap stabil.',
                        'info'
                    ]
                );
            }
        } catch (error) {
            console.error('Error pada cron pengingat anggaran pagi:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });

    // Pengingat Pencatatan Malam
    cron.schedule('0 20 * * *', async () => {
        try {
            console.log('Menjalankan pengecekan pengingat harian...');
            
            const [users] = await pool.execute('SELECT id FROM users');
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

            for (const user of users) {
                const [transactions] = await pool.execute(
                    'SELECT id FROM transactions WHERE user_id = ? AND DATE(date) = ?',
                    [user.id, today]
                );

                if (transactions.length === 0) {
                    await pool.execute(
                        `INSERT INTO notifications (user_id, title, message, type, is_read) 
                         VALUES (?, ?, ?, ?, 0)`,
                        [
                            user.id,
                            'Pengingat Pencatatan Transaksi',
                            'Anda belum mencatat aktivitas keuangan hari ini. Harap luangkan waktu sejenak untuk memperbarui catatan kas Anda demi akurasi data.',
                            'warning'
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error pada cron pengingat harian:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });
};

module.exports = { startCronJobs };