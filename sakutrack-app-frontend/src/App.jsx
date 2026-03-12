import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputTransaksi from './pages/InputTransaksi';

function App() {
  return (
    // mengaktifkan sistem navigasi aplikasi 
    <Router>
        <Routes>
          {/* jalur untuk halaman login (pintu masuk utama)*/}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input" element={<InputTransaksi />} />
        </Routes>
    </Router>
  );
}

export default App;
