const admin = require('../config/firebase');
const pool = require('../config/database');

// Notifikasi lewat firebase
const sendPushNotification = async (userId, title, body) => {
  try {
    const [rows] = await pool.execute('SELECT fcm_token FROM users WHERE id = ?', [userId]);
    const token = rows[0]?.fcm_token;

    if (!token) {
      console.log(`[PushLog] User ID ${userId} tidak punya token FCM. Push notification dilewati.`);
      return;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await admin.messaging().send(message);
    console.log('[PushLog] Berhasil kirim push notification:', response);
  } catch (error) {
    console.error('[PushLog] Gagal kirim push notification:', error);
  }
};

module.exports = { sendPushNotification };