import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultadosAnalise from '../components/ResultadosAnalise';
import { FiArrowLeft } from 'react-icons/fi';

function ResultadosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analise = location.state?.analise;

  if (!analise) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          <FiArrowLeft /> Voltar
        </button>
        <div className="alert alert-warning">
          ⚠️ Nenhuma análise encontrada. Faça upload de uma planilha primeiro.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
      >
        <FiArrowLeft /> Voltar
      </button>
      <ResultadosAnalise analise={analise} />
    </div>
  );
}

export default ResultadosPage;
