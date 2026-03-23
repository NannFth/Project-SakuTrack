import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions = [] }) {
  const categoryTotals = {};

  // Filter
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    const { category, amount } = t;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  // Konfigurasi Chart
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#4F46E5", 
          "#F43F5E", 
          "#FBBF24", 
          "#5cf6a4", 
          "#0EA5E9" 
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { 
            size: 11,
            family: "'Plus Jakarta Sans', sans-serif",
          }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
      }
    },
    cutout: "75%",
  };

  // Tampilan
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-8">
        Analisis Pengeluaran
      </h2>
      
      <div className="h-[280px] relative">
        {dataValues.length === 0 ? (
          <div className="h-full flex items-center justify-center border-dashed rounded-lg">
            <p className="text-slate-400 text-sm italic">Belum ada data pengeluaran</p>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kategori</span>
              <span className="text-2xl font-bold text-slate-800">
                {dataValues.length} 
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}