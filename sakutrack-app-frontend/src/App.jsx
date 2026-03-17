import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import TargetTabungan from './pages/TargetTabungan';
import Prediksi from './pages/Prediksi';
import Profil from './pages/Profil';
import DashboardLayout from './layouts/DashboardLayout';
import { useState } from 'react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Router>
      <Routes>
        {/*halaman login*/}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}><Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} /></DashboardLayout> } />
        <Route path="/input-transaksi" element={<DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}><InputTransaksi /></DashboardLayout>} />
        <Route path="/target-tabungan" element={<DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}><TargetTabungan /></DashboardLayout>} />
        <Route path="/prediksi" element={<DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}><Prediksi /></DashboardLayout>} />
        <Route path="/profil" element={<DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}><Profil /></DashboardLayout>} />
      </Routes>
    </Router>
  );
};

export default App;