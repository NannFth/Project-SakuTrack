import { useMemo } from 'react'; 
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions = [] }) {

  const { labels, dataValues } = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
      
        const category = t.category ? t.category.trim().toLowerCase() : "lainnya";
        const amount = parseFloat(t.amount) || 0;
        
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });

    return {
      labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      dataValues: Object.values(categoryTotals)
    };
  }, [transactions]);

  const generateColors = (num) => {
    const baseColors = ["#4F46E5", "#F43F5E", "#FBBF24", "#8B5CF6", "#0EA5E9", "#10B981", "#6366F1"];
    return Array.from({ length: num }, (_, i) => baseColors[i % baseColors.length]);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: generateColors(labels.length),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 15,
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
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        callbacks: {
          label: (context) => ` Rp ${context.raw.toLocaleString('id-ID')}`
        }
      }
    },
    cutout: "70%",
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border shadow-sm h-full min-h-[450px]">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Pengeluaran</h2>
      
      <div className="h-[300px] relative">
        {dataValues.length === 0 ? (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm italic">Belum ada data pengeluaran</p>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total</span>
              <span className="text-2xl font-black text-slate-800">
                {labels.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kategori</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}