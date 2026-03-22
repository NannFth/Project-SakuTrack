import { ArrowUpRight, ArrowDownLeft, Trash2, Clock } from "lucide-react";

export default function TransactionList({ data = [], onDelete }) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
        <p className="text-slate-400 text-sm italic">Belum ada riwayat transaksi</p>
      </div>
    );
  }

  // Urutan Transaksi
  const sortedTransactions = [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (dateA !== dateB) {
      return dateB - dateA;
    }
    
    const createdA = new Date(a.created_at).getTime();
    const createdB = new Date(b.created_at).getTime();
    return createdB - createdA;
  });

  // UI
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Riwayat Transaksi</h2>
        <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg font-medium">
          Terbaru
        </span>
      </div>

      <div className="space-y-4">
        {sortedTransactions.map((item) => {
          const isIncome = item.type === "income";
          
          const transactionDate = new Date(item.date);
          const createdAtDate = new Date(item.created_at);

          const formattedDate = transactionDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          
          const isSameDay = 
            transactionDate.getDate() === createdAtDate.getDate() &&
            transactionDate.getMonth() === createdAtDate.getMonth() &&
            transactionDate.getFullYear() === createdAtDate.getFullYear();

          const formattedTime = createdAtDate.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-1">
              
              {/* Icon dan Keterangan */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg flex-shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                  {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{item.description}</p>
                  
                  {/* Tanggal & Jam */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{formattedDate}</span>
                    
                    {isSameDay && (
                      <>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <div className="flex items-center gap-1 text-slate-400 font-medium">
                          <Clock size={10} />
                          <span>{formattedTime}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Nominal & Tombol Hapus */}
              <div className="flex items-center justify-end gap-4">
                <p className={`font-bold text-sm whitespace-nowrap ${isIncome ? "text-emerald-600" : "text-rose-500"}`}>
                  {isIncome ? "+" : "-"} Rp {Number(item.amount).toLocaleString('id-ID')}
                </p>

                <button 
                  onClick={() => onDelete && onDelete(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                  title="Hapus Transaksi"
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