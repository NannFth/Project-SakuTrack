import { Utensils, ShoppingBag, Car, BookOpen, Gamepad2, Package, Wallet, Banknote, Gift, Briefcase, Coins } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, FileText, Calendar } from "lucide-react";
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
  const [category, setCategory] = useState("Makanan/Minuman");
  const [date, setDate] = useState(formattedToday);
  const [loading, setLoading] = useState(false);
  const [openKategori, setOpenKategori] = useState(false);
  const [jenis, setJenis] = useState("kebutuhan");

  // Data Kategori
  const kategori = {
    expense: ["Makanan/Minuman", "Belanja", "Transportasi", "Pendidikan", "Hiburan", "Lainnya"],
    income: ["Uang Harian", "Gaji", "Bonus", "Bulanan", "Freelance", "Hadiah", "Lainnya"]
  };

  // Ikon
  const categoryIcons = {
    "Makanan/Minuman": <Utensils size={18} />,
    "Belanja": <ShoppingBag size={18} />,
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

  // Kirim Data
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
        date: date,
        jenis: jenis
      })
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          alert(`Gagal menyimpan: ${res.data.message}`);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error server:", error);
        alert("Terjadi kesalahan pada sistem.");
        setLoading(false);
      });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kelola Transaksi</h1>
          <p className="text-slate-500 text-sm mt-1">Masukan detail transaksi Anda.</p>
        </div>

        {/* Form Utama */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-8">
          
          {/* Tipe Transaksi */}
          <div className="flex p-1 bg-slate-100 rounded border border-slate-200 gap-1">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Makanan/Minuman"); setOpenKategori(false); }}
              className={`flex-1 py-3 rounded font-bold text-sm transition-colors ${type === "expense" ? "bg-white text-rose-600 shadow-sm border border-rose-100" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Uang Harian"); setOpenKategori(false); setJenis("kebutuhan"); }}
              className={`flex-1 py-3 rounded font-bold text-sm transition-colors ${type === "income" ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pemasukan
            </button>
          </div>

          {/* Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {type === "expense" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jenis
                </label>

                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded text-sm font-bold text-slate-700"
                >
                  <option value="kebutuhan">Kebutuhan</option>
                  <option value="keinginan">Keinginan</option>
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded focus:outline-none focus:border-slate-900 text-sm font-bold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Wallet size={14} /> Nominal
              </label>
              <input
                type="text"
                placeholder="Rp 0"
                value={amount}
                onChange={handleAmountChange}
                className={`w-full p-3 border border-slate-200 rounded focus:outline-none focus:border-slate-900 text-xl font-bold ${type === "income" ? "text-emerald-600" : "text-rose-600"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Kategori
              </label>
              <div className="relative">
                <div
                  onClick={() => setOpenKategori(!openKategori)}
                  className="w-full p-3 bg-white border border-slate-200 rounded cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={type === "income" ? "text-emerald-600" : "text-rose-600"}>
                      {categoryIcons[category]}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{category}</span>
                  </div>
                  <span className="text-slate-400 text-xs">{openKategori ? "▲" : "▼"}</span>
                </div>

                {/* Kategori */}
                {openKategori && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded shadow-md overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto">
                      {kategori[type].map((item, index) => (
                        <div 
                          key={index}
                          onClick={() => { setCategory(item); setOpenKategori(false); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                        >
                          <span className={type === "income" ? "text-emerald-600" : "text-rose-600"}>
                            {categoryIcons[item]}
                          </span>
                          <span className="text-sm font-bold text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Catatan
              </label>
              <input
                type="text"
                placeholder={type === "expense" ? "Contoh: Beli kopi" : "Contoh: Uang saku"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded focus:outline-none focus:border-slate-900 text-sm font-medium"
              />
            </div>
          </div>

          {/* Simpan */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded font-bold text-base shadow-sm flex items-center justify-center gap-2
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