const cron = require('node-cron');
const pool = require('../config/database');
const { sendPushNotification } = require('./notificationService');

const startCronJobs = (io) => {
    // Pengingat Anggaran Pagi
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('Menjalankan pengingat anggaran pagi...');
            const [users] = await pool.execute('SELECT id, name FROM users');

            for (const user of users) {
                const title = '🔔 Pengingat Anggaran Harian';
                const message = `Selamat pagi, ${user.name}. Mari mulai hari dengan bijak. Pastikan untuk memantau batas anggaran harian Anda agar keuangan tetap stabil.`;

                await pool.execute(
                    `INSERT INTO notifications (user_id, title, message, type, is_read) 
                     VALUES (?, ?, ?, ?, 0)`,
                    [user.id, title, message, 'info']
                );

                if (io) {
                    io.to(`user_${user.id}`).emit('new_notification', { 
                        title, 
                        message, 
                        type: 'info' 
                    });
                }

                await sendPushNotification(user.id, title, message);
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
            
            const [users] = await pool.execute('SELECT id, name FROM users');
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

            for (const user of users) {
                const [transactions] = await pool.execute(
                    'SELECT id FROM transactions WHERE user_id = ? AND DATE(date) = ?',
                    [user.id, today]
                );

                if (transactions.length === 0) {
                    const title = '🔔 Pengingat Pencatatan Transaksi';
                    const message = 'Anda belum mencatat aktivitas keuangan hari ini. Harap luangkan waktu sejenak untuk memperbarui catatan keuangan Anda.';

                    await pool.execute(
                        `INSERT INTO notifications (user_id, title, message, type, is_read) 
                         VALUES (?, ?, ?, ?, 0)`,
                        [user.id, title, message, 'warning']
                    );

                    if (io) {
                        io.to(`user_${user.id}`).emit('new_notification', { 
                            title, 
                            message, 
                            type: 'warning' 
                        });
                    }

                    await sendPushNotification(user.id, title, message);
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