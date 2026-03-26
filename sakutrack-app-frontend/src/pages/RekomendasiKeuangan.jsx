import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RekomendasiKeuangan = () => {
  const [activeStep, setActiveStep] = useState(0);

  const recommendations = [
    {
      id: 1,
      title: "Input Pemasukan Harian",
      description: "Awali harimu dengan mencatat saldo atau pemasukan yang masuk hari ini agar arus kas lebih terukur.",
      actionText: "Catat Sekarang",
      theme: "bg-blue-600"
    },
    {
      id: 2,
      title: "Atur Batas Pengeluaran",
      description: "Tentukan batas belanja maksimal untuk hari ini. Jangan sampai pengeluaran melebihi anggaran, ya!",
      actionText: "Set Limit",
      theme: "bg-orange-500"
    },
    {
      id: 3,
      title: "Alokasi Sisa Saldo",
      description: "Ada sisa dana dari anggaran kemarin? Yuk, segera pindahkan ke tabungan atau dana darurat.",
      actionText: "Tabung Sekarang",
      theme: "bg-emerald-600"
    }
  ];

  const handleNext = () => {
    setActiveStep((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Rekomendasi Tindakan</h2>
        <p className="text-sm text-gray-500">Langkah cerdas kelola uangmu hari ini</p>
      </div>

      <div className="relative h-56 overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 p-6 text-white flex flex-col justify-between ${recommendations[activeStep].theme}`}
          >
            <div>
              <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                {recommendations[activeStep].title}
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                {recommendations[activeStep].description}
              </p>
            </div>
            
            <button className="w-full py-2 bg-white text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              {recommendations[activeStep].actionText}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-2">
          {recommendations.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeStep === index ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className="flex items-center text-sm font-bold text-gray-700 hover:text-black"
        >
          {activeStep === recommendations.length - 1 ? "Mulai Lagi" : "Berikutnya"} 
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default RekomendasiKeuangan;