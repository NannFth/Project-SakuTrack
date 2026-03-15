import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft, Wallet, Tag, FileText, Calendar } from "lucide-react";
import { BASE_URL } from "../connection";

export default function InputTransaksi() {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Lainnya");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formatted = value ? "Rp " + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
    setAmount(formatted);
  };

  // Simpan
  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount === "" || description === "" || date === "") {
      alert("Harap isi nominal, catatan, dan tanggal.");
      return;
    }

    setLoading(true);

    const kunci = localStorage.getItem("userId");
    const cleanAmount = Number(amount.replace(/[^0-9]/g, ""));

    // Kirim Data
    fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': kunci
      },
      body: JSON.stringify({
        amount: cleanAmount,
        type: type,
        category: category,
        description: description,
        date: date
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          navigate("/dashboard");
        } else {
          alert(`Gagal menyimpan transaksi: ${result.message}`);
        }
      })
      .catch((error) => {
        console.log("Error server:", error);
        alert("Terjadi kesalahan pada sistem.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Catat Transaksi</h1>
            <p className="text-slate-400 font-medium text-sm">Masukan detail pengeluaran atau pemasukan Anda.</p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-50 space-y-6">
          
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === "expense" ? "bg-white text-rose-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === "income" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} /> Tanggal Transaksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm font-bold text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Wallet size={12} /> Nominal
              </label>
              <input
                type="text"
                placeholder="Rp 0"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-lg font-bold text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag size={12} /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm font-bold text-slate-600 appearance-none"
              >
                <option value="Makanan">Makanan & Minuman</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} /> Catatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli Kopi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow flex items-center justify-center gap-2
              ${loading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {loading ? 'Memproses...' : (
              <>
                Simpan Transaksi
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}