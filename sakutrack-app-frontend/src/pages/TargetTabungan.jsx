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
    const current = Number(item.currentAmount || item.current_amount || 0);
    const target = Number(item.targetAmount || item.target_amount || 0);

    if (current < target) {
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
  const updateSaldo = (id, saldoSekarang, nominalTambah, item) => {
    const totalBaru = Number(saldoSekarang) + Number(nominalTambah);
    const tgl = item.targetDate || item.target_date || new Date().toISOString().split('T')[0];

    const dataLengkap = {
      name: item.name,
      targetAmount: Number(item.targetAmount || item.target_amount),
      currentAmount: totalBaru,
      targetDate: tgl
    };

    connection.put(`/savings/${id}`, dataLengkap)
      .then((res) => {
        if (res.data.success === true || res.status === 200) {
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
          <h1 className="text-3xl font-bold text-slate-800">Target Tabungan</h1>
          <p className="text-slate-500 text-sm mt-1">Langkah kecil untuk mimpi besar Anda.</p>
        </header>

        {/* Form Input Target */}
        <div className="bg-white p-6 rounded shadow border border-slate-200">
          <div className="flex items-center gap-3 mb-6 text-slate-900">
            <Plus size={20} strokeWidth={3} />
            <h2 className="font-bold text-sm">Tambah Target Baru</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Mau beli apa?" value={name} onChange={(e) => setName(e.target.value)} 
              className="p-3 border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-sm" />
            <input type="text" placeholder="Target Rp" value={formatRupiah(targetAmount)} onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); setTargetAmount(raw); }} 
              className="p-3 border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-sm" />
            <input type="text" placeholder="Saldo Awal Rp" value={formatRupiah(currentAmount)} onChange={(e) =>  { const raw = e.target.value.replace(/\D/g, ""); setCurrentAmount(raw); }} 
              className="p-3 border border-slate-300 rounded focus:outline-none focus:border-slate-900 text-sm" />
          </div>
          <button onClick={tambahTarget} className="w-full mt-4 bg-slate-900 text-white p-3 rounded font-bold hover:bg-slate-800">
            Simpan Target
          </button>
        </div>

        {/* List Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savings.map((item) => {
            const current = Number(item.currentAmount || item.current_amount || 0);
            const target = Number(item.targetAmount || item.target_amount || 0);
            const persen = target > 0 ? Math.min((current / target) * 100, 100) : 0;

            return (
              <div key={item.id} className="bg-white p-6 rounded shadow border border-slate-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-100 text-slate-900 rounded">
                    <Target size={24} />
                  </div>

                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => selesaiTarget(item)}
                      className={`p-1.5 rounded ${persen >= 100 ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-300'}`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => hapusTarget(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right ml-2">
                      <p className="text-xs font-bold text-slate-400">Progress</p>
                      <p className="text-xl font-bold text-slate-900">{persen.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-500">
                    {formatRupiah(current)} / {formatRupiah(target)}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: `${persen}%` }} />
                </div>

                {/* Input Tambah Saldo */}
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Tambah nominal..."
                    className="flex-1 text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900"
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = raw ? "Rp " + new Intl.NumberFormat("id-ID").format(raw) : "";
                      e.target.value = formatted;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const rawValue = e.target.value.replace(/\D/g, "");
                        if (rawValue) {
                          updateSaldo(item.id, current, rawValue, item);
                          e.target.value = ""; 
                        }
                      }
                    }}
                  />
                  <div className="text-xs text-slate-400 italic flex items-center whitespace-nowrap">Enter untuk simpan</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}