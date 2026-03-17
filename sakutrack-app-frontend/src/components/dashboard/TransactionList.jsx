import {ArrowUpRight, ArrowDownLeft, Trash2} from "lucide-react"; 

export default function TransactionList({ data = [], onDelete }) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
        <p className="text-slate-400 text-sm italic">Belum ada riwayat transaksi</p>
      </div>
    );
  }
  const dataTerbaru = [...data].reverse();

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Riwayat Transaksi</h2>
        <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
          Terbaru
        </span>
      </div>

      <div className="space-y-4">
        {dataTerbaru.map((item) => {
          const isIncome = item.type === "income";

          return (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-50 pb-3 last:border-0">
              {/* icon dan ket */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg ${isIncome ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-500"}`}>
                  {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{item.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                </div>
              </div>

              {/* nominal & tombol hapus */}
              <div className="flex items-center justify-end gap-4 min-w-[160px]">
                <p className={`font-semibold text-sm whitespace-nowrap ${isIncome ? "text-indigo-600" : "text-rose-500"}`}>
                  {isIncome ? "+" : "-"} Rp {item.amount.toLocaleString('id-ID')}
                </p>

                {/* tombol sampah */}
              <button 
                onClick={() => onDelete(item.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                title="Haapus Transaksi"
              >
                <Trash2 size={16} />
              </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}