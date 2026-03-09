import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InputTransaksi = () => {
    const navigate = useNavigate();

    const namaUser = localStorage.getItem("user_nama") || "User";
    const keyDinamis = `riwayat_${namaUser}`;

    const [nominal, setNominal] = useState("");
    const [catatan, setCatatan] = useState("");
    const [jenis, setJenis] = useState("pengeluaran");

    const handleSubmit = (e) => {
        e.preventDefault();

        const riwayatLama = JSON.parse(localStorage.getItem(keyDinamis) || "[]");

        const transaksiBaru = {
            tanggal: new Date().toLocaleDateString(),
            nominal: Number(nominal),
            catatan: catatan,
            jenis: jenis
        };

        const riwayatBaru = [...riwayatLama, transaksiBaru];
        localStorage.setItem(keyDinamis, JSON.stringify(riwayatBaru));
        navigate("/dashboard");
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Tambah Transaksi</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                    value={jenis}
                    onChange={(e)  => setJenis(e.target.value)}
                    className="p-3 border rounded-xl"
                >
                    <option value="pengeluaran">Pengeluaran</option>
                    <option value="pemasukan">Pemasukan</option>
                </select>

                <input
                    type="number"
                    placeholder="Nominal"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    className="p-3 border rounded-xl"
                />

                 <input
                    type="text"
                    placeholder="Catatan"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="p-3 border rounded-xl"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-xl"
                >
                    Simpan Transaksi 
                </button>

            </form>
        </div>
    );
};

export default InputTransaksi;