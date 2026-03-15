import {ArrowUpRight, ArrowDownLeft} from "lucide-react"; 

export default function TransactionList({ data = [] }) {
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
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isIncome ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-500"}`}>
                  {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                
                <div>
                  <p className="font-medium text-slate-800 text-sm">{item.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold text-sm ${isIncome ? "text-indigo-600" : "text-rose-500"}`}>
                  {isIncome ? "+" : "-"} Rp {item.amount.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-2 text-xs text-slate-400 hover:text-indigo-600 transition border-t pt-4">
        Lihat Semua Aktivitas
      </button>
    </div>
  );
}