import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function FinanceChart({ pemasukan_tren = [], pengeluaran_tren = [], label_waktu = [] }) {

  const isDataEmpty = pemasukan_tren.length === 0 && pengeluaran_tren.length === 0;

  const data = {
    labels: label_waktu,
    datasets: [
      {
        label: "Pemasukan",
        data: pemasukan_tren,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        fill: true, 
        tension: 0.3, 
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: "#10b981",
        borderWidth: 2,
      },
      {
        label: "Pengeluaran",
        data: pengeluaran_tren, 
        borderColor: "#ef4444", 
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: "#ef4444",
        borderWidth: 2,
      },
    ],
  };
      
  // Pengaturan Grafik
  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { 
        display: true,
        position: 'top', 
        align: 'end',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#94a3b8',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { size: 11 },
          color: '#cbd5e1',
          callback: (value) => `Rp ${value.toLocaleString()}`
        }
      }
    }
  };

  // UI
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Tren Arus Kas
        </h2>
      </div>

      <div className="h-[300px]">
        {isDataEmpty ? (
          <div className="h-full flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-slate-400 text-sm italic">Data tren kosong</p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}