import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';
import TargetTabungan from './pages/TargetTabungan';
import Prediksi from './pages/Prediksi';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/input-transaksi" element={<InputTransaksi />} />
        <Route path="/target-tabungan" element={<TargetTabungan />} />
        <Route path="/prediksi" element={<Prediksi />} />
      </Routes>
    </Router>
  );
};

export default App;