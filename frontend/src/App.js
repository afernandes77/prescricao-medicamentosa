import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import ResultadosPage from './pages/ResultadosPage';
import './App.css';

function App() {
  const [analiseAtual, setAnaliseAtual] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<UploadPage onAnaliseCompleta={setAnaliseAtual} />} 
            />
            <Route 
              path="/resultados" 
              element={<ResultadosPage analise={analiseAtual} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
