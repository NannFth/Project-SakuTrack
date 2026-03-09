import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // mengambil ikon panah kembali

const InputData = () => {
    const navigate = useNavigate(); // fungsi untuk berpindah halaman

    const [nominal, setNominal] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const handleSimpan = () => {
        if (nominal && keterangan) {
            const namaAktif = localStorage.getItem("user_nama") || "umum";
            const keyDinamis = `riwayat_${namaAktif}`;
            // ambil data lama dari memori browser
            const dataLama = JSON.parse(localStorage.getItem(keyDinamis) || "[]");

            // masukkan data
            const dataBaru = {
                id: Date.now(),
                nominal: parseInt(nominal),
                keterangan: new Date().toLocaleDateString()
            };

            // gabungkan dan simpan kembali
            localStorage.setItem(keyDinamis, JSON.stringify([...dataLama, dataBaru]));
            alert("Catatan Berhasil Disimpan!");
            navigate('/dashboard'); // kembali ke dashboard baru
        } else {
            alert("Isi nominal dan keterangan dulu yaaa!");
        }
    };


    return (
        <div className="p-6">
            {/* tombol kembali ke dashboard (navigate(-1)  artinya kembali ke halaman sebelumnya) */}
            <button
                onClick={() => navigate(-1)}
                className="flex-center text-blue-600 font-bold mb-8 text-sm underline"
            >
                <ChevronLeft size={16} /> kembali
            </button>

            <h2 className="text-2xl font-bold mb-8 text-slate-800 tracking-tight">Catata Pengeluaran</h2>

            <form className="space-y-6">
                {/* bagian input nominal uang */}
                <div>
                    <label className="text-[10px] font-bold text-slaye-400 uppercase mb-2 block tracking-widest">
                        Nominal (Rp)
                    </label>
                    <input
                        type="number"
                        placeholder="Contoh:15000"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* bagian input kketerangan jajan */}
                <div>
                    <label className="text-[10px] font-bold text-slaye-400 uppercase mb-2 block tracking-widest">
                        Keterangan
                    </label>
                    <input 
                        type="text"
                        placeholder="Contoh: Jajan kantin"
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        className="w-full p-4 bg-slate-50 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                {/* tombol simpan-untuk sekarang kita arahkan kembali ke dashboard */}
                <button 
                    type="button"
                    onClick={handleSimpan}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all mt-6"
                >
                    Simpan Catatan
                </button>
            </form>

            {/* footer identitas tim */}
            <p className="mt-12 text-[10px] text-center text-slate-300 uppercase tracking-widest font-bold">
                SakuTrack-Capstone Project CC26-PS075
            </p>
        </div>
    );
};

export default InputData;