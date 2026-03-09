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
    const modalAwal = 1000000;
    const totalPengeluaran = riwayat.reduce((acc, curr) => acc + curr.nominal, 0);
    const saldo = modalAwal - totalPengeluaran;
    const hari = riwayat.length > 0 ? Math.floor(saldo / (totalPengeluaran / riwayat.length)) : 30;

    const dataPengeluaran = riwayat.length > 0
        ? riwayat.slice(-7).map(item => item.nominal)
        : [0, 0, 0, 0, 0, 0, 0];

    const chartData = {
        labels: ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'],
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

            {/* grafik tren pengeluaran */}
            <div className="mt-8">
                <h3 className="font-bold text-sm text-slate-700 mb-4">Tren Pengeluaran</h3>
                <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
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