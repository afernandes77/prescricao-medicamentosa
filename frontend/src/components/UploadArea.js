import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiAlertCircle } from 'react-icons/fi';
import { BiCheckCircle } from 'react-icons/bi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadArea({ onAnaliseCompleta }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    // Validar extensão
    if (!validExtensions.includes(fileExtension)) {
      setError('❌ Formato inválido. Use Excel (.xlsx, .xls) ou CSV (.csv)');
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('❌ Arquivo muito grande. Máximo 10MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/prescricoes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentComplete);
        }
      });

      if (response.data.sucesso) {
        setSuccess(
          `✅ ${response.data.total_prescricoes} prescrições processadas com sucesso!`
        );
        onAnaliseCompleta(response.data);
        
        // Redirecionar para resultados após 2 segundos
        setTimeout(() => {
          navigate('/resultados', { state: { analise: response.data } });
        }, 2000);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(
        err.response?.data?.erro || '❌ Erro ao processar arquivo. Tente novamente.'
      );
    } finally {
      setUploading(false);
    }
  }, [navigate, onAnaliseCompleta]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto mb-4 text-blue-500" size={48} />
        <p className="text-xl font-semibold text-gray-700">
          {isDragActive ? '📁 Solte o arquivo aqui' : '📤 Arraste a planilha aqui'}
        </p>
        <p className="text-gray-500 mt-2">ou clique para selecionar</p>
        <p className="text-sm text-gray-400 mt-4">Formatos suportados: .xlsx, .xls, .csv (Máx: 10MB)</p>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="spinner" />
            <span className="font-medium text-blue-800">Processando...</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-blue-700 mt-2">{progress}%</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error flex items-start gap-3">
          <FiAlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success flex items-start gap-3">
          <BiCheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}

export default UploadArea;
