import { useState, useEffect } from "react"; 
import { Plus, Target, Trash2, CheckCircle2 } from "lucide-react";
import connection from "../connection";

export default function TargetTabungan() {
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [balanceInputs, setBalanceInputs] = useState({});

  const formatRupiah = (value) => {
    if (!value) return "";
    return "Rp " + new Intl.NumberFormat("id-ID").format(value);
  };

  const fetchData = () => {
    connection.get('/savings')
      .then((res) => {
        if (res.data.success) {
          setSavings(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Yakin mau hapus target tabungan ini?")) {
      connection.delete(`/savings/${id}`)
        .then((res) => {
          if (res.data.success) {
            fetchData();
          }
        })
        .catch((err) => console.error("Gagal hapus:", err));
    }
  };

  const validateCompletion = (item) => {
    const current = Number(item.current_amount || item.currentAmount || 0);
    const target = Number(item.target_amount || item.targetAmount || 0);

    if (current < target) {
      alert("Tabungan belum penuh nih, tetap semangat dan pantang menyerah ya!");
      return;
    }
    alert(`Selamat! Target "${item.name}" sudah tercapai!`);
  };

  const handleAddTarget = () => {
    if (!name || !targetAmount) {
      alert("Wajib isi nama dan target.");
      return;
    }

    const date = new Date().toISOString().split('T')[0];

    connection.post('/savings', {
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount || 0),
        targetDate: date
      })
      .then((res) => {
        if (res.data.success) {
          fetchData();
          setName(""); 
          setTargetAmount(""); 
          setCurrentAmount("");
        }
      })
      .catch((err) => {
        console.error("Gagal simpan:", err);
        alert("Gagal menyimpan target.");
      });
  };

  const handleUpdateBalance = (id, currentBalance, amountToAdd, item) => {
    const addition = Number(amountToAdd);

    if (!addition || addition <= 0) {
      alert("Nominal tidak valid");
      return;
    }

    const newTotal = Number(currentBalance) + addition;

    const payload = {
      name: item.name || "",
      targetAmount: Number(item.target_amount || item.targetAmount || 0),
      currentAmount: newTotal,
      targetDate: item.target_date || item.targetDate 
        ? (item.target_date || item.targetDate).split("T")[0]
        : new Date().toISOString().split("T")[0]
    };

    connection.put(`/savings/${id}`, payload)
      .then((res) => {
        if (res.data.success || res.status === 200) {
          fetchData();
          setBalanceInputs(prev => ({ ...prev, [id]: "" }));
        }
      })
      .catch((err) => {
        console.error("ERROR UPDATE:", err.response?.data || err.message);
        fetchData(); 
        alert("Gagal memperbarui saldo (Gangguan notifikasi).");
      });
  };

  const calculateEstimation = (item) => {
    const current = Number(item.current_amount || item.currentAmount || 0);
    const target = Number(item.target_amount || item.targetAmount || 0);

    if (target <= 0 || current >= target) return null;

    const createdRaw = item.created_at || item.createdAt || item.target_date || item.targetDate;
    if (!createdRaw) return null;

    const createdDate = new Date(createdRaw);
    if (isNaN(createdDate.getTime())) return null;

    const today = new Date();
    const daysDiff = Math.max(Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)), 1);

    if (current <= 0) return "Yuk, mulai menabung untuk lihat estimasi!";

    const dailyRate = current / daysDiff;
    if (dailyRate <= 0) return "Yuk, tambah lagi saldonya!";

    const remaining = target - current;
    const estimatedDays = Math.ceil(remaining / dailyRate);

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return {
      days: estimatedDays,
      date: completionDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };
  };

  return (
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
        <button onClick={handleAddTarget} className="w-full mt-4 bg-slate-900 text-white p-3 rounded font-bold hover:bg-slate-800 transition-colors">
          Simpan Target
        </button>
      </div>

      {/* List Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savings.map((item) => {
          const current = Number(item.current_amount || item.currentAmount || 0);
          const target = Number(item.target_amount || item.targetAmount || 0);
          const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
          const isCompleted = percentage >= 100;

          return (
            <div 
              key={item.id}
                className={`p-6 rounded shadow border transition-all space-y-4 ${
                  isCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200'
                }`} 
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-900'}`}>
                  <Target size={24} />
                </div>

                <div className="flex gap-2 items-center">
                  <button 
                    onClick={() => validateCompletion(item)}
                    className={`p-1.5 rounded ${isCompleted ? 'text-emerald-600 hover:bg-emerald-100' : 'text-slate-300'}`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="text-right ml-2">
                    <p className="text-xs font-bold text-slate-400">Progress</p>
                    <p className={`text-xl font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-900'}`}>{percentage.toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  {isCompleted && (
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      Selesai
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500">
                  {formatRupiah(current)} / {formatRupiah(target)}
                </p>

                <div className="min-h-[20px] mt-1">
                  {(() => {
                    const estimation = calculateEstimation(item);
                    if (!estimation) return null;

                    if (typeof estimation === "string") {  
                      return (
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded w-fit">
                          {estimation}
                        </p>
                      );
                    }

                    return (
                      <p className="text-xs leading-relaxed bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 w-fit">
                        <span className="opacity-80">Estimasi:</span>
                        <span className="font-extrabold ml-1 underline decoration-blue-300">
                          {estimation.days} hari
                        </span> lagi
                        <span className="text-[10px] ml-1 opacity-70">({estimation.date})</span>
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`} style={{ width: `${percentage}%` }} />
              </div>

              {/* Input Tambah Saldo */}
              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <input 
                  type="text" 
                  placeholder={isCompleted ? "Target sudah tercapai!" : "Tambah nominal..."}
                  value={isCompleted ? "" : (balanceInputs[item.id] ? formatRupiah(balanceInputs[item.id]) : "")}
                  disabled={isCompleted}
                  className={`flex-1 text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 ${
                    isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-600 font-bold placeholder:text-emerald-600 text-center" : ""
                  }`}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setBalanceInputs((prev) => ({ ...prev, [item.id]: raw }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const rawValue = balanceInputs[item.id];
                      if (rawValue) {
                        handleUpdateBalance(item.id, current, rawValue, item);
                      }
                    }
                  }}
                />
                {!isCompleted && (
                  <div className="text-[10px] text-slate-400 italic flex items-center whitespace-nowrap leading-none">
                    Enter untuk simpan
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}