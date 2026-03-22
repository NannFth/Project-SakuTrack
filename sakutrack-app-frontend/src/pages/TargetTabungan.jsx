import { useState, useEffect } from "react"; 
import { Plus, Target, Trash2, CheckCircle2 } from "lucide-react";
import connection from "../connection";

export default function TargetTabungan() {
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const formatRupiah = (value) => {
    if (!value) return "";
    return "Rp " + new Intl.NumberFormat("id-ID").format(value);
  };

  // Ambil data
  const ambilData = () => {
    connection.get('/savings')
      .then((res) => {
        if (res.data.success === true) {
          setSavings(res.data.data);
        }
      })
      .catch((err) => {
        console.log("Gagal mengambil data:", err);
      });
  };

  useEffect(() => {
    ambilData();
  }, []);

  // Hapus tabungan
  const hapusTarget = (id) => {
    if (window.confirm("Yakin mau hapus target tabungan ini?")) {
      connection.delete(`/savings/${id}`)
        .then((res) => {
          if (res.data.success === true) {
            ambilData();
          }
        })
        .catch((err) => console.log("Gagal hapus:", err));
    }
  };

  // Validasi target 
  const selesaiTarget = (item) => {
    if (item.currentAmount < item.targetAmount) {
      alert("Tabungan belum penuh nih, tetap semangat dan pantang menyerah ya!");
      return;
    }
    alert(`Selamat! Target "${item.name}" sudah tercapai!`);
  }

  const tambahTarget = () => {
    if (name === "" || targetAmount === "") {
      alert("Wajib isi nama dan target.");
      return;
    }

    const tanggal = new Date().toISOString().split('T')[0];

    connection.post('/savings', {
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount || 0),
        targetDate: tanggal
      })
      .then((res) => {
        if (res.data.success === true) {
          ambilData();
          setName(""); 
          setTargetAmount(""); 
          setCurrentAmount("");
        }
      })
      .catch((err) => {
        console.log("Gagal simpan:", err);
        alert("Gagal menyimpan target.");
      });
  };

  // Update Saldo
  const updateSaldo = (id, saldoSekarang, nominalTambah) => {
    const totalBaru = saldoSekarang + Number(nominalTambah);

    connection.put(`/savings/${id}`, { currentAmount: totalBaru })
      .then((res) => {
        if (res.data.success === true) {
          ambilData();
        }
      })
      .catch((err) => {
        console.log("Gagal update:", err);
        alert("Gagal memperbarui saldo.");
      });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 p-4">
        <header>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Target Tabungan</h1>
          <p className="text-slate-400 font-medium text-sm">Langkah kecil untuk mimpi besar Anda.</p>
        </header>

        {/* Form Input Target */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-6 text-indigo-600">
            <Plus size={20} strokeWidth={3} />
            <h2 className="font-bold uppercase tracking-widest text-xs">Tambah Target Baru</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Mau beli apa?" value={name} onChange={(e) => setName(e.target.value)} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium" />
            <input type="text" placeholder="Target Rp" value={formatRupiah(targetAmount)} onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); setTargetAmount(raw); }} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium" />
            <input type="text" placeholder="Saldo Awal Rp" value={formatRupiah(currentAmount)} onChange={(e) =>  { const raw = e.target.value.replace(/\D/g, ""); setCurrentAmount(raw); }} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium" />
          </div>
          <button onClick={tambahTarget} className="w-full mt-4 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Simpan Target
          </button>
        </div>

        {/* List Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savings.map((item) => {
            const persen = Math.min((item.currentAmount / item.targetAmount) * 100, 100);

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-50 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Target size={24} />
                  </div>

                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => selesaiTarget(item)}
                      className={`p-1.5 rounded-full transition-all ${persen >= 100 ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-200'}`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => hapusTarget(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right ml-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Progress</p>
                      <p className="text-xl font-black text-indigo-600">{persen.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {formatRupiah(item.currentAmount)} / {formatRupiah(item.targetAmount)}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${persen}%` }} />
                </div>

                {/* Input Tambah Saldo */}
                <div className="pt-4 border-t border-slate-50 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Tambah nominal..."
                    className="flex-1 text-xs p-2 bg-slate-50 rounded-xl outline-none focus:ring-1 focus:ring-indigo-300"
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = raw ? "Rp " + new Intl.NumberFormat("id-ID").format(raw) : "";
                      e.target.value = formatted;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        if (rawValue) {
                          updateSaldo(item.id, item.currentAmount, rawValue);
                          e.target.value = ""; 
                        }
                      }
                    }}
                  />
                  <div className="text-[10px] text-slate-300 italic flex items-center whitespace-nowrap">Enter untuk simpan</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}