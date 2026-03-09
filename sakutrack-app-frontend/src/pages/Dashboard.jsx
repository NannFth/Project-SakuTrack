import React from 'react';
import BalanceCard from '../components/BalanceCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid } from 'lucide-react';

// library chart.js untuk visualisasi data
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const namaUser = location.state?.nama || localStorage.getItem("user_nama") || "User";
    const keyDinamis = `riwayat_${namaUser}`;
    const sekolahUser = location.state?.sekolah || localStorage.getItem("user_sekolah") || "SMK NEGERI";

    const riwayat = JSON.parse(localStorage.getItem(keyDinamis) || "[]");
    // ambil 7 transaksi terakhir
    const last7 = riwayat.slice(-7);
    const modalAwal = 1000000;
    //hitung total pengeluaran
    const totalPengeluaran = last7
        .filter(item => item.jenis === "pengeluaran")
        .reduce((acc, curr) => acc + (curr.nominal || 0), 0);
    //hitung total pemasukan
    const totalPemasukan = last7
        .filter(item => item.jenis === "pemasukan")
        .reduce((acc, curr) => acc + (curr.nominal || 0), 0);
    //hitung saldo sekrang
    const saldo = modalAwal + totalPemasukan - totalPengeluaran;
    // tambahkan target tabungan
    const targetTabungan = Number(localStorage.getItem("target_tabungan") || 0);
    const progressTabungan = Math.max(0, Math.min(saldo, targetTabungan));
    //hitung rata-rata pengeluaran
    const rataPengeluaran=
        last7.length > 0 ? totalPengeluaran / last7.length : 0;
    const hari = rataPengeluaran > 0 ? Math.floor(saldo / rataPengeluaran) : 30;

    const dataPengeluaran = last7.map(item => item.nominal || 0);
        

    const chartData = {
        labels: last7.map(item => item.tanggal || "-"),
        datasets: [{
            fill: true,
            label: 'Pengeluaran',
            data: dataPengeluaran,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
        }],
    };

    return (
        <div className="p-6 pb-24">
        {/* header profile siswa smk */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="font-bold text-xl text-slate-800">Halo, {namaUser}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sekolahUser}</p>
                </div>
                <div className="bg-slate-100 p-2 rounded-xl text-blue-600"><LayoutGrid size={20} /></div>
            </div>

            {/* memanggil komponen kartu saldo */}
            <BalanceCard balance={saldo} projection={hari} />

            <div className="mt-6 bg-white p-4 rounded-2xl border">
                <p className="text-sm text-slate-500">Target Tabungan</p>

                <p className="text-lg font-bold">
                    Rp{progressTabungan.toLocaleString()} / Rp{targetTabungan.toLocaleString()}
                </p>
            </div>

            {/* riwayat transaksi */}
            <div className="mt-8">
                <h3 className="font-bold text-sm text-slate-700 mb-4">Riwayat Transaksi</h3>
                <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <Line data={chartData} 
                        options={{ 
                            responsive: true, 
                            plugins: { 
                                legend: { display: false } 
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }     
                        }} 
                    />
                </div>
            </div>

            <h3 className="fot-bold text-sm text-slate-700">Daftar Transaksi</h3>
            <div className="mt-6 space-y-3">
                {last7.length === 0 ? (
                    <p className="text-sm text-slate-400">Belum Ada Transaksi</p>
                ) : (
                    last7.slice().reverse().map((item, index) => (
                        <div 
                            key={index}
                            className="flex justify-between items-center bg-white p-3 rounded-xl border"
                        >
                            <div>
                                <p className="text-sm font-semibold">{item.catatan || "Transaksi"}</p>
                                <p className="text-xs text-slate-400">{item.tanggal}</p>
                            </div>

                            <p className={`text-sm font-bold ${item.jenis === "pemasukan" ? "text-green-500" : "text-red-500"}`}>
                                {item.jenis === "pemasukan" ? "+" : "-"}Rp{item.nominal?.toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* tombol melayang (+) untuk tambah data */}
            <button 
                onClick={() => navigate('/input')}
                className="fixed bottom-8 right-1/2 translate-x-1/2 w-14  h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all active:scale-90"
            >
                <Plus size={28} /> 
            </button>
        </div>
    );
};

export default Dashboard;