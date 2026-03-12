export default function TransactionList({ data = [] }) {

    if(data.length === 0) {
        return <p className="text-slate-400">Belum Ada Transasksi</p>
    }

    return (
        <div className="bg-white p-4 rounded-xl border">

            {data.slice().reverse().map((item) => (
                <div 
                    key={item.id}
                    className="flex justify-between border-b py-2"
                >
                    <div>
                        <p className="font-bold">{item.catatan}</p>
                        <p className="text-xs text-slate-400">{item.tanggal}</p>
                    </div>

                    <p 
                        className={
                            item.jenis === "Pemasukan"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                    >
                        Rp {item.nominal.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}