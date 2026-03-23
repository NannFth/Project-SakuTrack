import { useMemo } from 'react'; 
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions = [] }) {
  // warna kategori
  const CATEGORY_COLORS = {
    "makanan/minuman": "#FBBF24",
    "transportasi": "#0EA5E9",
    "pendidikan": "#4F46E5",
    "hiburan": "#F43F5E",
    "lainnya": "#94A3B8"
  };

  // Data
  const { labels, dataValues, backgroundColors } = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category = t.category ? t.category.trim().toLowerCase() : "lainnya";
        const amount = parseFloat(t.amount) || 0;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });

    const keys = Object.keys(categoryTotals);

    return {
      labels: keys.map(cat =>
        cat.split('/')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('/')
      ),
      dataValues: Object.values(categoryTotals),
      backgroundColors: keys.map(cat => CATEGORY_COLORS[cat] || "#CBD5E1")
    };
  }, [transactions]);


  // Chart
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
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
          padding: 15,
          font: { size: 10, family: "sans-serif" }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 10,
        callbacks: {
          label: (context) => ` Rp ${context.raw.toLocaleString('id-ID')}`
        }
      }
    },
    cutout: "70%",
  };

  // UI
  return (
    <div className="bg-white p-6 rounded border border-slate-200 shadow-sm h-full min-h-[400px]">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Analisis Pengeluaran</h2>
      
      <div className="h-[280px] relative mt-4">
        {dataValues.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded">
            <p className="text-slate-400 text-xs italic">Belum ada data pengeluaran</p>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
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