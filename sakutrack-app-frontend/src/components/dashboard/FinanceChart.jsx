import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function FinanceChart({ pemasukan, pengeluaran }) {

   const data = {
    labels: ["Pemasukan, pengeluaran"],
    datasets: [
        {
            label: "Grafik Keuangan",
            data: [pemasukan, pengeluaran],
            backgroundColor: ["#22c55e", "#ef4444"],
            borderRadius: 8,
        },
    ],
    };
     
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-4">
                Grafik Keuangan
            </h2>

            {pemasukan === 0 && pengeluaran === 0 ? (
                <p className="text-gray-400">Belum ada transaksi</p>
            ) : (
                <Bar data={data} options={options} />
            )}

            <div className="mt-4 text-sm">
                <p>Pemasukan: Rp {pemasukan.toLocaleString()}</p>
                <p>Pengeluaran: Rp {pengeluaran.toLocaleString()}</p>
            </div>
        </div>
    );
}