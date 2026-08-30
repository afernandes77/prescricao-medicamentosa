import React from 'react';
import {
  FiDownload,
  FiFileText,
  FiAlertTriangle,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { BiSolidFile } from 'react-icons/bi';
import axios from 'axios';

function ResultadosAnalise({ analise }) {
  if (!analise) {
    return (
      <div className="alert alert-warning">
        Nenhuma análise disponível. Faça upload de uma planilha.
      </div>
    );
  }

  const handleExportar = async (formato) => {
    try {
      const response = await axios.get(
        `/api/prescricoes/${analise.id_planilha}/exportar/${formato}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interacoes_medicamentosas.${formato === 'excel' ? 'xlsx' : formato}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (erro) {
      console.error('Erro ao exportar:', erro);
      alert('Erro ao exportar arquivo');
    }
  };

  const getSeveridadeColor = (severidade) => {
    switch (severidade) {
      case 'Crítica':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Grave':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Leve':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeveridadeIcon = (severidade) => {
    switch (severidade) {
      case 'Crítica':
      case 'Grave':
        return <FiAlertTriangle className="inline mr-2" />;
      case 'Moderada':
        return <FiAlertTriangle className="inline mr-2" />;
      case 'Leve':
        return <FiCheck className="inline mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Resumo Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-600 text-sm">Total de Prescrições</p>
            <p className="text-3xl font-bold text-blue-600">{analise.total_prescricoes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-gray-600 text-sm">Com Interações</p>
            <p className="text-3xl font-bold text-red-600">
              {analise.analise.prescricoes_com_interacoes.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm">Sem Interações</p>
            <p className="text-3xl font-bold text-green-600">
              {analise.analise.prescricoes_sem_interacoes}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-gray-600 text-sm">Total de Interações</p>
            <p className="text-3xl font-bold text-orange-600">
              {analise.analise.total_interacoes}
            </p>
          </div>
        </div>
      </div>

      {/* Botões de Exportação */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📥 Exportar Resultados</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExportar('excel')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <BiSolidFile /> Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExportar('pdf')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <FiFileText /> PDF
          </button>
          <button
            onClick={() => handleExportar('csv')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <FiDownload /> CSV
          </button>
        </div>
      </div>

      {/* Detalhes das Interações */}
      <div className="space-y-4">
        {analise.analise.prescricoes_com_interacoes.length > 0 ? (
          analise.analise.prescricoes_com_interacoes.map((prescricao, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Rx #{prescricao.numero_prescricao}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    💊 Medicamentos: {prescricao.medicamentos.join(', ')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm border ${
                    getSeveridadeColor(prescricao.severidade_maxima)
                  }`}
                >
                  {getSeveridadeIcon(prescricao.severidade_maxima)}
                  {prescricao.severidade_maxima}
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <p className="font-semibold text-gray-700">
                  ⚠️ Interações encontradas ({prescricao.interacoes.length}):
                </p>
                {prescricao.interacoes.map((inter, interIdx) => (
                  <div
                    key={interIdx}
                    className={`p-3 rounded-lg border ${
                      getSeveridadeColor(inter.severidade)
                    }`}
                  >
                    <p className="font-semibold">
                      {inter.medicamento1} ↔️ {inter.medicamento2}
                    </p>
                    <p className="text-sm mt-1">{inter.descricao}</p>
                    {inter.recomendacao && (
                      <p className="text-sm mt-2 italic">💡 {inter.recomendacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-success">
            ✅ Nenhuma interação medicamentosa identificada!
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultadosAnalise;
