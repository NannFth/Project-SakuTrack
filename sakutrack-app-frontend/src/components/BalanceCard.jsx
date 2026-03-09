import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react'; // library ikon yang sudah kita install

const BalanceCard = ({ balance, projection }) => {
    return (
        /* wadah utama kartu dengan desain gradasi modern */
        <div className="bg-gradient-to-br from-blue-600 to-indio-800 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <div className="flex items-center gap-2 mb-1 opacity-70 uppercase text-[10px] tracking-widest fonst-bold">
                <Wallet size={14} />
                <span>Sisa Saldo Kamu</span>
            </div>

            {/* menampilkan saldo dengan format rupiah */}
            <h2 className="text-3xl font-extrabold mb-5">Rp {balance.toLocaleString('id-ID')}</h2>

            {/* fitur prediksi ketahanan saldo */}
            <div className="flex items-center justify-between bg-white/20  p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <TrendingUp size={16} className={projection <3 ? "text-orange-300" : "text-green-300"} />
                    <span>Cukup Untuk:</span>
                </div>
                <span className="text-sm font-bold">{projection} Hari</span>
            </div>
        </div>
    );
};

export default BalanceCard;