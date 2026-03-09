import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputData from './pages/InputData';

function App() {
  return (
    // mengaktifkan sistem navigasi aplikasi 
    <Router>
      {/*container utama dengan batas lebar maksimal agar pas di layar hp (mobile first) */}
      <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-x-hidden">
        <Routes>
          {/* jalur untuk halaman login (pintu masuk utama)*/}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<InputData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
