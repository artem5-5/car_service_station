import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Layout/AppNavbar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Parts from './pages/Parts';
import Services from './pages/Services';
import Financial from './pages/Financial';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/services" element={<Services />} />
            <Route path='/financial' element={<Financial />} />
            <Route path='/orders' element={<Orders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;