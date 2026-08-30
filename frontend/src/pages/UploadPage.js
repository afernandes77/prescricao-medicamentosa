import React from 'react';
import UploadArea from '../components/UploadArea';

function UploadPage({ onAnaliseCompleta }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🏥 Verificador de Interações Medicamentosas
        </h1>
        <p className="text-gray-600">
          Faça upload de uma planilha com as prescrições dos pacientes e identifique
          possíveis interações medicamentosas de forma rápida e segura.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Fazer Upload</h2>
        <UploadArea onAnaliseCompleta={onAnaliseCompleta} />
      </div>

      {/* Informações sobre formato */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">📖 Formato da Planilha</h3>
        <p className="text-blue-800 mb-3">Sua planilha deve conter as seguintes colunas:</p>
        <div className="bg-white rounded p-4 text-sm text-gray-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-2 font-bold">Coluna</th>
                <th className="text-left py-2 px-2 font-bold">Exemplo</th>
                <th className="text-left py-2 px-2 font-bold">Obrigatória</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-2">numero_prescricao</td>
                <td className="py-2 px-2">RX-001</td>
                <td className="py-2 px-2">✅</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-2">codigo_medicamento</td>
                <td className="py-2 px-2">ATC-001</td>
                <td className="py-2 px-2">❌</td>
              </tr>
              <tr>
                <td className="py-2 px-2">nome_medicamento</td>
                <td className="py-2 px-2">Amoxicilina 500mg</td>
                <td className="py-2 px-2">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
