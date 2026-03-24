import { ArrowUpRight, ArrowDownLeft, Trash2, Clock } from "lucide-react";

export default function TransactionList({ data = [], onDelete }) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded border shadow text-center">
        <p className="text-slate-500 text-sm italic">Belum ada riwayat transaksi</p>
      </div>
    );
  }

  const sortedTransactions = data;

  // UI
  return (
    <div className="bg-white p-6 rounded border shadow h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
        <span className="text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded font-bold">
          Terbaru
        </span>
      </div>

      <div className="space-y-4">
        {sortedTransactions.map((item) => {
          const isIncome = item.type === "income";

          console.log("DATA ITEM:", item);
          
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
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-200 pb-3 last:border-0 hover:bg-slate-50 rounded px-1">
              
              {/* Keterangan */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded flex-shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.description}</p>
                  
                  {/* Tanggal & Jam */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize text-slate-600">
                        {item.category || "Lainnya"}
                      </span>

                        <span 
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                            ${
                              item.jenis === "kebutuhan"
                              ? "bg-blue-100 text-blue-600"
                              : item.jenis === "keinginan"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {item.jenis || "Tidak ada"}
                        </span>
                    </div>

                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{formattedDate}</span>
                    {isSameDay && (
                      <>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <div className="flex items-center gap-1 text-slate-500 font-bold">
                          <Clock size={10} />
                          <span>{formattedTime}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Nominal & Hapus */}
              <div className="flex items-center justify-end gap-4">
                <p className={`font-bold text-sm whitespace-nowrap ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                  {isIncome ? "+" : "-"} Rp {Number(item.amount).toLocaleString('id-ID')}
                </p>

                <button 
                  onClick={() => onDelete && onDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
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