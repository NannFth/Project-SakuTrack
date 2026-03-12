import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, saveTransaction } from "../services/storage";


export default function InputTransaksi() {

    const navigate = useNavigate();
    const user = getUser();

    
    const [nominal, setNominal] = useState("");
    const [catatan, setCatatan] = useState("");
    const [jenis, setJenis] = useState("pengeluaran");

    
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            id: Date.now(),
            tanggal: new Date().toLocaleDateString('id-ID'),
            nominal: Number(nominal),
            catatan,
            jenis,
        };

        saveTransaction(user.nama, data);

        navigate("/dashboard");
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">
                Tambah Transaksi
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
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
}