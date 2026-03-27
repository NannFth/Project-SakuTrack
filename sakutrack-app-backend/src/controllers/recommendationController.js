const pool = require('../config/database');

const financialTips = [
    "Catat setiap pengeluaran, sekecil apa pun, agar arus kas selalu terpantau.",
    "Biasakan menabung pada awal bulan, bukan menunggu sisa uang di akhir bulan.",
    "Membawa bekal dari rumah adalah langkah cerdas dalam mengelola keuangan.",
    "Tunda pembelian barang mahal selama 24 jam untuk memastikan itu benar-benar kebutuhan.",
    "Bedakan dengan bijak antara 'kebutuhan' dan sekadar 'keinginan'.",
    "Siapkan dana darurat setidaknya untuk memenuhi biaya hidup selama 3 bulan ke depan.",
    "Pastikan total cicilan bulanan Anda tidak melebihi 30% dari total pendapatan.",
    "Buatlah anggaran bulanan dan disiplinlah dalam mematuhinya.",
    "Mulailah berinvestasi sedini mungkin agar uang dapat bekerja untuk Anda.",
    "Hindari utang konsumtif, terutama penggunaan paylater untuk hal yang tidak mendesak.",
    "Sediakan uang tunai secukupnya agar tidak terlalu bergantung pada dompet digital.",
    "Batalkan layanan langganan yang jarang Anda gunakan untuk menghemat pengeluaran.",
    "Manfaatkan promo atau diskon hanya jika barang tersebut memang Anda butuhkan.",
    "Jangan ragu untuk menolak ajakan bersosialisasi yang memakan biaya jika anggaran sedang terbatas.",
    "Tetapkan target tabungan harian, misalnya Rp10.000. Sedikit demi sedikit akan menjadi bukit.",
    "Evaluasi pengeluaran Anda setiap akhir pekan untuk mengetahui riwayat transaksi.",
    "Jual barang layak pakai yang sudah tidak digunakan untuk menambah pemasukan.",
    "Gunakan rekening yang berbeda untuk tabungan dan kebutuhan sehari-hari.",
    "Beli barang berkualitas meskipun harganya sedikit lebih tinggi, daripada murah tetapi cepat rusak.",
    "Jangan menjadikan kegiatan berbelanja sebagai pelampiasan saat sedang stres.",
    "Pahami konsep inflasi untuk menyadari pentingnya berinvestasi sejak dini.",
    "Sisihkan sebagian pendapatan untuk berbagi dengan sesama agar keuangan lebih berkah.",
    "Waspadai 'Latte Factor' atau pengeluaran kecil namun terjadi secara terus-menerus.",
    "Alokasikan 50% dari bonus atau pendapatan tambahan Anda untuk ditabung atau diinvestasikan.",
    "Rawatlah barang-barang Anda dengan baik agar tidak perlu sering membeli yang baru.",
    "Buat daftar belanjaan sebelum ke pasar atau swalayan agar terhindar dari pembelian impulsif.",
    "Periksa tagihan utilitas secara rutin; menghemat energi berarti menghemat uang.",
    "Pilihlah lingkungan pertemanan yang mendukung gaya hidup sesuai dengan kemampuan finansial Anda.",
    "Pastikan target tabungan bulanan sudah tercapai sebelum mengalokasikan dana untuk hiburan.",
    "Masa depan finansial Anda ditentukan oleh keputusan yang Anda buat hari ini."
];

const getRecommendations = async (req, res) => {
    try {
        const { uid } = req.user;

        // Ambil ID
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
        const today = new Date();
        
        // Ambil format 
        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        
        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.getFullYear() + '-' + String(yesterdayDate.getMonth() + 1).padStart(2, '0') + '-' + String(yesterdayDate.getDate()).padStart(2, '0');

        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const daysLeft = daysInMonth - today.getDate() + 1;

        let recommendations = [];

        // Ambil data Income & Expense
        const [transaksiBulanIni] = await pool.execute(`
            SELECT type, SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
            GROUP BY type
        `, [userId, currentMonth, currentYear]);

        let totalIncome = 0;
        let totalExpense = 0;

        transaksiBulanIni.forEach(row => {
            if (row.type === 'income') totalIncome = parseFloat(row.total);
            if (row.type === 'expense') totalExpense = parseFloat(row.total);
        });

        const saldo = totalIncome - totalExpense;

        // Batas Harian
        if (saldo > 0) {
            const dailyLimit = Math.floor(saldo / daysLeft);
            recommendations.push({
                type: 'daily_limit',
                message: `Batas pengeluaran aman Anda hari ini adalah Rp ${dailyLimit.toLocaleString('id-ID')}. Usahakan untuk tidak melebihinya.`
            });
        } else {
            recommendations.push({
                type: 'daily_limit',
                message: "Saldo Anda bulan ini sudah mencapai batas. Mari lebih berhemat hingga waktu gajian tiba."
            });
        }

        // Evaluasi Kebutuhan & Keinginan
        const [wantsNeedsData] = await pool.execute(`
            SELECT jenis, SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'expense' AND MONTH(date) = ? AND YEAR(date) = ?
            GROUP BY jenis
        `, [userId, currentMonth, currentYear]);

        let totalWants = 0;
        let totalNeeds = 0;

        wantsNeedsData.forEach(row => {
            if (row.jenis && row.jenis.toLowerCase() === 'keinginan') totalWants = parseFloat(row.total);
            if (row.jenis && row.jenis.toLowerCase() === 'kebutuhan') totalNeeds = parseFloat(row.total);
        });

        const totalExpenseKategori = totalWants + totalNeeds;
        if (totalExpenseKategori > 0) {
            const wantsPercentage = (totalWants / totalExpenseKategori) * 100;
            if (wantsPercentage > 30) {
                recommendations.push({
                    type: 'warning_wants',
                    message: `Pengeluaran 'Keinginan' Anda mencapai ${Math.round(wantsPercentage)}% dari total pengeluaran. Harap kendalikan agar fokus pada kebutuhan utama.`
                });
            }
        }

        // Evaluasi Pengeluaran Kemarin
        const [yesterdaySpend] = await pool.execute(`
            SELECT SUM(amount) as total FROM transactions 
            WHERE user_id = ? AND type = 'expense' AND DATE(date) = ?
        `, [userId, yesterdayStr]);

        const totalKemarin = yesterdaySpend[0].total ? parseFloat(yesterdaySpend[0].total) : 0;
        if (totalKemarin > 50000) {
            recommendations.push({
                type: 'yesterday_eval',
                message: `Kemarin Anda menghabiskan Rp ${totalKemarin.toLocaleString('id-ID')}. Mari mencoba untuk lebih berhemat pada hari ini.`
            });
        }

        // Progres Target Tabungan 
        const [savings] = await pool.execute(`
            SELECT id, goal_name, target_amount, current_amount 
            FROM savings 
            WHERE user_id = ? 
            ORDER BY target_date ASC
        `, [userId]);

        const activeSavings = savings.filter(item => {
            return parseFloat(item.current_amount || 0) < parseFloat(item.target_amount || 0);
        });

        if (activeSavings.length > 0) {
            const target = activeSavings[0];
            const targetAmount = parseFloat(target.target_amount || 0);
            const currentAmount = parseFloat(target.current_amount || 0);
            const progress = Math.round((currentAmount / targetAmount) * 100);
            const remaining = targetAmount - currentAmount;
            
            recommendations.push({
                type: 'goal_progress',
                message: `Progres tabungan [${target.goal_name}] baru mencapai ${progress}%. Anda memerlukan Rp ${remaining.toLocaleString('id-ID')} lagi.`
            });

            // Alokasi Surplus
            const expectedDailyLimit = 50000; 
            if (saldo > (expectedDailyLimit * daysLeft)) {
                const surplus = saldo - (expectedDailyLimit * daysLeft);
                recommendations.push({
                    type: 'surplus_allocation',
                    message: `Ada sisa dana aman sekitar Rp ${surplus.toLocaleString('id-ID')}. Anda dapat mengalokasikannya ke target [${target.goal_name}] agar lebih cepat tercapai.`
                });
            }
        }

        // Tantangan Harian & Streak
        const isBawaBekalDay = today.getDate() % 2 === 0;
        if (isBawaBekalDay) {
            recommendations.push({
                type: 'challenge',
                message: "Tantangan Hari Ini: Bawalah bekal dari rumah untuk menghemat anggaran makan siang Anda."
            });
        } else {
            recommendations.push({
                type: 'challenge',
                message: "Tantangan Hari Tanpa Belanja: Cobalah untuk tidak mengeluarkan uang untuk kategori 'Keinginan' sama sekali hari ini."
            });
        }

        const [streakData] = await pool.execute(`
            SELECT COUNT(DISTINCT DATE(date)) as streak_days
            FROM transactions 
            WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
        `, [userId]);

        if (streakData[0].streak_days >= 3) {
            recommendations.push({
                type: 'streak_praise',
                message: "Luar biasa! Anda sangat konsisten mencatat keuangan selama 3 hari terakhir. Pertahankan kebiasaan baik ini."
            });
        }

        // Tips Finansial Harian
        const tipIndex = today.getDate() % financialTips.length;
        recommendations.push({
            type: 'financial_tip',
            message: `💡 Tip Hari Ini: ${financialTips[tipIndex]}`
        });

        res.status(200).json({
            success: true,
            message: 'Rekomendasi berhasil diambil',
            data: recommendations
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat mengambil rekomendasi',
            error: error.message
        });
    }
};

module.exports = { getRecommendations };