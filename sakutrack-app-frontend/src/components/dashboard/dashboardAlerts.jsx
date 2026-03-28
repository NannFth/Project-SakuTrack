import Swal from 'sweetalert2';

export const checkDashboardAlerts = (data, currentWantsRatio) => {
  const jatahKeinginan = data.balance * (currentWantsRatio / 100);
  const todayString = new Date().toLocaleDateString('id-ID');
  const savedDate = localStorage.getItem('lastDashboardAlertDate');

  if (savedDate !== todayString) {
    // Peringtan Boros
    if (data.totalExpense > jatahKeinginan && data.totalExpense > 0) {
      localStorage.setItem('lastDashboardAlertDate', todayString);
      Swal.fire({
        title: 'Waspada, Pengeluaranmu Melampaui Batas! 💸',
        html: `Pengeluaranmu (<b>Rp ${data.totalExpense.toLocaleString('id-ID')}</b>) telah melewati jatah keinginan (<b>Rp ${Math.floor(jatahKeinginan).toLocaleString('id-ID')}</b>). <br><br> Ayo mulai kendalikan pengeluaranmu agar rencana masa depanmu tetap aman!`,
        icon: 'warning',
        background: '#ffffff',
        borderRadius: '20px',
        confirmButtonText: '<span style="color: black !important; font-weight: bold;">Siap, Saya Mengerti!</span>',
        confirmButtonColor: '#ffffff',
        buttonsStyling: true,
        customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
      });
    } 
    
    // Saldo Kritis
    else if (data.balance < 50000 && data.balance > 0) {
      localStorage.setItem('lastDashboardAlertDate', todayString);
      Swal.fire({
        title: 'Peringatan: Saldo Kamu Kritis! ⚠️',
        html: `Saldo kamu saat ini tersisa <b>Rp ${data.balance.toLocaleString('id-ID')}</b>. <br> Berhati-hatilah dalam bertransaksi agar tidak terjadi defisit saldo.`,
        icon: 'error',
        background: '#ffffff',
        borderRadius: '20px',
        confirmButtonText: '<span style="color: black !important; font-weight: bold;">Oke, Saya Akan Berhemat!</span>',
        confirmButtonColor: '#ffffff',
        buttonsStyling: true,
        customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
      });
    }

    // Apareisiasi Hemat
    else if (data.totalExpense > 0 && data.totalExpense < (jatahKeinginan * 0.1)) {
      localStorage.setItem('lastDashboardAlertDate', todayString);
      Swal.fire({
        title: 'Luar Biasa, Kamu Hebat! 🌟',
        html: `Pengeluaranmu bulan ini sangat terkendali. <br> Pertahankan kedisiplinan finansial ini untuk kebebasan masa depanmu!`,
        icon: 'success',
        background: '#ffffff',
        borderRadius: '20px',
        confirmButtonText: '<span style="color: black !important; font-weight: bold;">Lanjutkan!</span>',
        confirmButtonColor: '#ffffff',
        buttonsStyling: true,
        customClass: { confirmButton: 'force-show-text border border-slate-300 px-6 py-2' }
      });
    }
  }
};