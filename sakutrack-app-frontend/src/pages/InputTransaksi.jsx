import { Utensils, Car, BookOpen, Gamepad2, Package, Wallet, Banknote, Gift, Briefcase, Coins } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, FileText, Calendar } from "lucide-react";
import connection from "../connection";

export default function InputTransaksi() {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Lainnya");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [openKategori, setOpenKategori] = useState(false);

  // List Kategori
  const kategori = {
    expense: ["Makanan/Minuman", "Transportasi", "Pendidikan", "Hiburan", "Lainnya"],
    income: ["Uang Harian", "Gaji", "Bonus", "Bulanan", "Freelance", "Hadiah", "Lainnya"]
  };

  const categoryIcons = {
    "Makanan/Minuman": <Utensils size={16} />,
    "Transportasi": <Car size={16} />,
    "Pendidikan": <BookOpen size={16} />,
    "Hiburan": <Gamepad2 size={16} />,
    "Lainnya": <Package size={16} />,
    "Uang Harian": <Wallet size={16} />,
    "Gaji": <Briefcase size={16} />,
    "Bonus": <Gift size={16} />,
    "Bulanan": <Coins size={16} />,
    "Freelance": <Banknote size={16} />,
    "Hadiah": <Gift size={16} />,
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formatted = value ? "Rp " + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
    setAmount(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount === "" || description === "" || date === "") {
      alert("Harap isi nominal, catatan, dan tanggal.");
      return;
    }

    setLoading(true);
    const cleanAmount = Number(amount.replace(/[^0-9]/g, ""));

    connection.post('/transactions', {
        amount: cleanAmount,
        type: type,
        category: category,
        description: description,
        date: date
      })
      .then((res) => {
        if (res.data.success) {
          navigate("/dashboard");
        } else {
          alert(`Gagal menyimpan: ${res.data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error server:", error);
        alert("Terjadi kesalahan pada sistem.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Catat Transaksi</h1>
            <p className="text-slate-400 font-medium text-sm">Masukan detail pengeluaran atau pemasukan Anda.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-50 space-y-6">
          {/* Tipe */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Makanan/Minuman"); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === "expense" ? "bg-white text-rose-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Uang Harian"); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === "income" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-4">
            {/* Tanggal */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Calendar size={12} /> Tanggal Transaksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 outline-none text-sm font-bold text-slate-600"
              />
            </div>

            {/* Nominal */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Wallet size={12} /> Nominal
              </label>
              <input
                type="text"
                placeholder="Rp 0"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 outline-none text-lg font-bold text-slate-800"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Tag size={12} /> Kategori
              </label>
              <div className="relative">
                <div
                  onClick={() => setOpenKategori(!openKategori)}
                  className="w-full p-4 bg-slate-50 rounded-2xl cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={type === "income" ? "text-indigo-500" : "text-rose-500"}>
                      {categoryIcons[category]}
                    </span>
                    <span className="text-sm font-bold text-slate-600">{category}</span>
                  </div>
                </div>

                {/* Scroller */}
                {openKategori && (
                  <div className="absolute z-10 w-full mt-2 bg-white border rounded-2xl shadow-lg overflow-hidden">
                    <div className="max-h-[160px] overflow-y-auto">
                      {kategori[type].map((item, index) => (
                        <div 
                          key={index}
                          onClick={() => { setCategory(item); setOpenKategori(false); }}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all"
                        >
                          <span className={type === "income" ? "text-indigo-500" : "text-rose-500"}>
                            {categoryIcons[item]}
                          </span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <FileText size={12} /> Catatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli Kopi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow flex items-center justify-center gap-2
              ${loading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            {loading ? 'Memproses...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </>
  );
}