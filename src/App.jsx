// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Link to="/" className="text-white font-bold">Home</Link>
            <Link to="/invoice" className="text-white font-bold">Invoices</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invoice" element={<InvoicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;