import { useState, useEffect } from "react"; 
import DashboardLayout from "../layouts/DashboardLayout";
import { Plus, Target } from "lucide-react";
import { BASE_URL } from "../connection";

export default function TargetTabungan() {
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  // Ambil Data
  const ambilData = () => {
    const kunci = localStorage.getItem("userId");
    
    fetch(`${BASE_URL}/savings`, {
      headers: { "Authorization": kunci }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          setSavings(result.data);
        }
      })
      .catch((err) => {
        console.log("Gagal mengambil data:", err);
      });
  };

  useEffect(() => {
    ambilData();
  }, []);

  // Simpan Target
  const tambahTarget = () => {
    if (name === "" || targetAmount === "") {
      alert("Wajib isi nama dan target.");
      return;
    }

    const tanggal = new Date().toISOString().split('T')[0];
    const kunci = localStorage.getItem("userId");

    fetch(`${BASE_URL}/savings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': kunci 
      },
      body: JSON.stringify({
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount || 0),
        targetDate: tanggal
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
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

  // Tambah Saldo
  const updateSaldo = (id, saldoSekarang, nominalTambah) => {
    const kunci = localStorage.getItem("userId");
    const totalBaru = saldoSekarang + Number(nominalTambah);

    fetch(`${BASE_URL}/savings/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': kunci 
      },
      body: JSON.stringify({ currentAmount: totalBaru })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success === true) {
          ambilData();
        }
      })
      .catch((err) => {
        console.log("Gagal update:", err);
        alert("Gagal memperbarui saldo.");
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Target Tabungan</h1>
          <p className="text-slate-400 font-medium text-sm">Langkah kecil untuk mimpi besar Anda.</p>
        </header>

        {/* Input */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-6 text-indigo-600">
            <Plus size={20} strokeWidth={3} />
            <h2 className="font-bold uppercase tracking-widest text-xs">Tambah Target Baru</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Mau beli apa?" value={name} onChange={(e) => setName(e.target.value)} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
            <input type="number" placeholder="Target Rp" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
            <input type="number" placeholder="Saldo Awal Rp" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} 
              className="p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm" />
          </div>
          <button onClick={tambahTarget} className="w-full mt-4 bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Simpan Target
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savings.map((item) => {
            const persen = Math.min((item.currentAmount / item.targetAmount) * 100, 100);

            return (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-50 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Target size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Progress</p>
                    <p className="text-xl font-black text-indigo-600">{persen.toFixed(0)}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Rp {item.currentAmount.toLocaleString()} / Rp {item.targetAmount.toLocaleString()}
                  </p>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${persen}%` }} />
                </div>

                {/* Update */}
                <div className="pt-4 border-t border-slate-50 flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Masukkan nominal tambahan..."
                    className="flex-1 text-xs p-2 bg-slate-50 rounded-xl outline-none focus:ring-1 focus:ring-indigo-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateSaldo(item.id, item.currentAmount, e.target.value);
                        e.target.value = ""; 
                      }
                    }}
                  />
                  <div className="text-[10px] text-slate-300 italic flex items-center whitespace-nowrap">Enter untuk nambah</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}