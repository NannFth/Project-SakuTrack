import { Utensils, Car, BookOpen, Gamepad2, Package, Wallet, Banknote, Gift, Briefcase, Coins } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, FileText, Calendar } from "lucide-react";
import connection from "../connection";

export default function InputTransaksi() {
  const navigate = useNavigate();
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Lainnya");
  const [date, setDate] = useState(formattedToday);
  const [loading, setLoading] = useState(false);
  const [openKategori, setOpenKategori] = useState(false);

  // List Kategori
  const kategori = {
    expense: ["Makanan/Minuman", "Transportasi", "Pendidikan", "Hiburan", "Lainnya"],
    income: ["Uang Harian", "Gaji", "Bonus", "Bulanan", "Freelance", "Hadiah", "Lainnya"]
  };

  const categoryIcons = {
    "Makanan/Minuman": <Utensils size={18} />,
    "Transportasi": <Car size={18} />,
    "Pendidikan": <BookOpen size={18} />,
    "Hiburan": <Gamepad2 size={18} />,
    "Lainnya": <Package size={18} />,
    "Uang Harian": <Wallet size={18} />,
    "Gaji": <Briefcase size={18} />,
    "Bonus": <Gift size={18} />,
    "Bulanan": <Coins size={18} />,
    "Freelance": <Banknote size={18} />,
    "Hadiah": <Gift size={18} />,
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
      <div className="max-w-3xl mx-auto py-2">
        <div className="flex items-center gap-4 mb-7">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white hover:bg-slate-100 rounded-lg shadow-sm border border-slate-300 transition-colors">
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kelola Transaksi Harian</h1>
            <p className="text-slate-500 text-base mt-0.5">Masukan detail transaksi Anda.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-7 rounded-xl shadow-md border border-slate-300 space-y-7">
          {/* Tipe */}
          <div className="flex p-1 bg-slate-100 rounded-lg gap-1.5">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Makanan/Minuman"); }}
              className={`flex-1 py-3 rounded text-base font-bold transition-all ${type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Uang Harian"); }}
              className={`flex-1 py-3 rounded text-base font-bold transition-all ${type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pemasukan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tanggal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-2 ml-1">
                <Calendar size={14} /> Tanggal Transaksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-sm font-bold text-slate-800"
              />
            </div>

            {/* Nominal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-2 ml-1">
                <Wallet size={14} /> Nominal
              </label>
              <input
                type="text"
                placeholder="Rp 0"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-xl font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-2 ml-1">
                <Tag size={14} /> Kategori
              </label>
              <div className="relative">
                <div
                  onClick={() => setOpenKategori(!openKategori)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={type === "income" ? "text-emerald-600" : "text-rose-600"}>
                      {categoryIcons[category]}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{category}</span>
                  </div>
                </div>

                {/* Scroller */}
                {openKategori && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white border border-slate-300 rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto">
                      {kategori[type].map((item, index) => (
                        <div 
                          key={index}
                          onClick={() => { setCategory(item); setOpenKategori(false); }}
                          className="flex items-center gap-2.5 px-4 py-3 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
                        >
                          <span className={type === "income" ? "text-emerald-600" : "text-rose-600"}>
                            {categoryIcons[item]}
                          </span>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-2 ml-1">
                <FileText size={14} /> Catatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli Kopi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2
                ${loading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {loading ? 'Memproses...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}