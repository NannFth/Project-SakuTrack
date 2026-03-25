import { useState, useEffect } from "react"; 
import { Plus, Target, Trash2, CheckCircle2 } from "lucide-react";
import connection from "../connection";

export default function TargetTabungan() {
  const [savings, setSavings] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [inputSaldo, setInputSaldo] = useState({});

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
    const tambah = Number(nominalTambah);

    if(!tambah || tambah <= 0) {
      alert("Nominal tidak valid");
      return;
    }

    const totalBaru = Number(saldoSekarang) + tambah;

    const dataLengkap = {
      name: item.name || "",
      targetAmount: Number(item.targetAmount || item.target_amount || 0),
      currentAmount: totalBaru,
      targetDate: item.targetDate || item.target_date 
        ? (item.targetDate || item.target_date).split("T")[0]
        : new Date().toISOString().split("T")[0]
    };

    connection.put(`/savings/${id}`, dataLengkap)
      .then((res) => {
        console.log("RES:", res.data);

        if (res.data.success === true || res.status === 200) {
          ambilData();
        } else {
          alert("Update gagal dari server");
        }
      })
      .catch((err) => {
        console.log("ERROR UPDATE:", err.response?.data || err.message);
        alert("Gagal memperbarui saldo.");
      });
  };

  // estimasi target tercapai
  const hitungEstimasi = (item) => {
    const current = Number(item.currentAmount || item.current_amount || 0);
    const target = Number(item.targetAmount || item.target_amount || 0);

    if (target <= 0) return null;
    if (current >= target) return "Target sudah tercapai";

    const createdRaw = item.targetDate || item.target_date || item.createdAt || item.created_at;
    if (!createdRaw) return null;

    const createdDate = createdRaw ? new Date(createdRaw) : new Date();

    if (isNaN(createdDate.getTime())) {
      console.error("Format tanggal salah untuk item:", item.name);
      return null;
    }

    const today = new Date();

    // selisih hari
    const diffInMs = today - createdDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const selisihHari = Math.max(diffInDays, 1);

    if (current <= 0) return "Yuk, mulai menabung untuk lihat estimasi!";

    // rata rata tabungan perhari
    const rataPerHari = current / selisihHari;

    if (rataPerHari <= 0) return "Yuk, tambah lagi saldonya!";

    const sisa = target - current;
    const estimasiHari = Math.ceil(sisa / rataPerHari);

    const tanggalSelesai = new Date();
    tanggalSelesai.setDate(tanggalSelesai.getDate() + estimasiHari);

    return {
      hari: estimasiHari,
      tanggal: tanggalSelesai.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };
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
            console.log("Cek Data Item:", item.name, "Tanggal:", item.targetDate || item.target_date);
            const current = Number(item.currentAmount || item.current_amount || 0);
            const target = Number(item.targetAmount || item.target_amount || 0);
            const persen = target > 0 ? Math.min((current / target) * 100, 100) : 0;

            const isSelesai = persen >= 100;

            return (
              <div 
                key={item.id}
                  className={`p-6 rounded shadow border transition-all space-y-4 ${
                    isSelesai
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`} 
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded ${isSelesai ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-900'}`}>
                    <Target size={24} />
                  </div>

                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => selesaiTarget(item)}
                      className={`p-1.5 rounded ${isSelesai ? 'text-emerald-600 hover:bg-emerald-100' : 'text-slate-300'}`}
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
                      <p className={`text-xl font-bold ${isSelesai ? 'text-emerald-600' : 'text-slate-900'}`}>{persen.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                    {isSelesai && (
                      <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded full uppercase tracking-wider font-bold">
                        Selesai
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500">
                    {formatRupiah(current)} / {formatRupiah(target)}
                  </p>

                  <div className="min-h-[20px]">
                    {(() => {
                      if (isSelesai) return null;

                      const estimasi = hitungEstimasi(item);
                      if (!estimasi) return null;

                      if (typeof estimasi === "string") {  
                        return (
                          <p className="text-xs text-emerald-600 mt-1 font-bold uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded w-fit">
                            {estimasi}
                          </p>
                        );
                      }

                      return (
                        <p className="text-xs mt-1 leading-relaxed bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 w-fit">
                          <span className="opacity-80">Estimasi:</span>
                          <span className="font-extrabold ml-1 underline decoration-blue-300">
                            {estimasi.hari} hari
                          </span> lagi
                          <span className="text-[10px] ml-1 opacity-70">({estimasi.tanggal})</span>
                        </p>
                      );
                    })()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isSelesai ? 'bg-emerald-500' : 'bg-slate-900'}`} style={{ width: `${persen}%` }} />
                </div>

                {/* Input Tambah Saldo */}
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <input 
                    type="text" 
                    placeholder={isSelesai ? "Target sudah tercapai!" : "Tambah nominal..."}
                    value={isSelesai ? "" : (inputSaldo[item.id] ? formatRupiah(inputSaldo[item.id]) : "")}
                    disabled={isSelesai}
                    className={`flex-1 text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-slate-900 ${
                      isSelesai ? "bg-emerald-50 border-emerald-200 text-emerald-600 font-bold placeholder:text-emerald-600 text-center" : ""
                    }`}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");

                      setInputSaldo((prev) => ({
                        ...prev,
                        [item.id]: raw
                      }));
                    }}

                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const rawValue = inputSaldo[item.id];
                        if (rawValue) {
                          updateSaldo(item.id, current, rawValue, item);
                          
                          setInputSaldo((prev) => ({
                            ...prev,
                            [item.id]: ""
                          }));
                        }
                      }
                    }}
                  />
                  {!isSelesai && (
                    <div className="text-xs text-slate-400 italic flex items-center whitespace-nowrap">
                      Enter untuk simpan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}