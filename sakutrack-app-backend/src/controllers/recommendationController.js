const db = require('../config/database');

// Finansial Tips 
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

exports.getRecommendations = async (req, res) => {
    const userId = req.params.userId;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Tanggal kemarin
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysLeft = daysInMonth - today.getDate() + 1;

    try {
        let recommendations = [];

        // Ambil data
        const [transaksiBulanIni] = await db.promise().query(`
            SELECT type, SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
            GROUP BY type
        `, [userId, currentMonth, currentYear]);

        let totalIncome = 0;
        let totalExpense = 0;

        transaksiBulanIni.forEach(row => {
            if (row.type === 'income') totalIncome = row.total;
            if (row.type === 'expense') totalExpense = row.total;
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

        // Evaluasi Keinginan
        const [wantsNeedsData] = await db.promise().query(`
            SELECT jenis, SUM(amount) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'expense' AND MONTH(date) = ? AND YEAR(date) = ?
            GROUP BY jenis
        `, [userId, currentMonth, currentYear]);

        let totalWants = 0;
        let totalNeeds = 0;

        wantsNeedsData.forEach(row => {
            if (row.jenis && row.jenis.toLowerCase() === 'keinginan') totalWants = row.total;
            if (row.jenis && row.jenis.toLowerCase() === 'kebutuhan') totalNeeds = row.total;
        });

        const totalExpenseBulanIni = totalWants + totalNeeds;
        if (totalExpenseBulanIni > 0) {
            const wantsPercentage = (totalWants / totalExpenseBulanIni) * 100;
            if (wantsPercentage > 30) {
                recommendations.push({
                    type: 'warning_wants',
                    message: `Pengeluaran untuk kategori 'Keinginan' Anda telah mencapai ${Math.round(wantsPercentage)}% dari total pengeluaran bulan ini. Harap kendalikan pengeluaran Anda.`
                });
            }
        }

        // Evaluasi Kemarin
        const [yesterdaySpend] = await db.promise().query(`
            SELECT SUM(amount) as total FROM transactions 
            WHERE user_id = ? AND type = 'expense' AND DATE(date) = ?
        `, [userId, yesterdayStr]);

        const totalKemarin = yesterdaySpend[0].total || 0;
        if (totalKemarin > 50000) {
            recommendations.push({
                type: 'yesterday_eval',
                message: `Kemarin Anda menghabiskan Rp ${totalKemarin.toLocaleString('id-ID')}. Mari mencoba untuk lebih berhemat hari ini.`
            });
        }

        // Progres 
        const [savings] = await db.promise().query(`
            SELECT id, goal_name, target_amount, current_amount, target_date 
            FROM savings 
            WHERE user_id = ? AND current_amount < target_amount
            ORDER BY target_date ASC LIMIT 1
        `, [userId]);

        if (savings.length > 0) {
            const target = savings[0];
            const progress = Math.round((target.current_amount / target.target_amount) * 100);
            const sisaDuitBuatTarget = target.target_amount - target.current_amount;
            
            recommendations.push({
                type: 'goal_progress',
                message: `Progres target tabungan [${target.goal_name}] Anda baru mencapai ${progress}%. Anda membutuhkan Rp ${sisaDuitBuatTarget.toLocaleString('id-ID')} lagi untuk menyelesaikannya.`
            });

            // Alokasi Sisa
            const expectedDailyLimit = 50000;
            if (saldo > (expectedDailyLimit * daysLeft)) {
                const surplus = saldo - (expectedDailyLimit * daysLeft);
                recommendations.push({
                    type: 'surplus_allocation',
                    message: `Terdapat sisa dana yang aman sekitar Rp ${surplus.toLocaleString('id-ID')}. Anda dapat mengalokasikannya ke target tabungan [${target.goal_name}] agar lebih cepat tercapai.`
                });
            }
        }

        // Tantangan harian
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

        // Apresiasi Konsistensi 
        const [streakData] = await db.promise().query(`
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

        // Tips Finansial 
        const tipIndex = today.getDate() % financialTips.length;
        recommendations.push({
            type: 'financial_tip',
            message: `💡 Tip Hari Ini: ${financialTips[tipIndex]}`
        });

        res.status(200).json({
            status: 'success',
            data: recommendations
        });

    } catch (error) {
        console.error("Gagal mengambil rekomendasi:", error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
    }
};