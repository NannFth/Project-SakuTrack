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
        backgroundColor: ["#2200ff", "#ff0000", "#15ff00", "#00ccff", "#ff8c00"],
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
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
      }
    },
    cutout: "70%",
  };

  // Tampilan
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-8">
        Top Kategori
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
              <span className="text-lg font-semibold text-slate-400">Total Kategori</span>
              <span className="text-lg font-semibold text-slate-700">
                {dataValues.length} 
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}