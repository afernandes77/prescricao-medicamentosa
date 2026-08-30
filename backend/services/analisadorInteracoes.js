const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Carregar base de interações
let baseInteracoes = [];

const carregarBaseInteracoes = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../data/interacoes_meds.csv');
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Arquivo de interações não encontrado: ${filePath}`);
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        baseInteracoes.push({
          medicamento1: (data.medicamento1 || '').toLowerCase().trim(),
          medicamento2: (data.medicamento2 || '').toLowerCase().trim(),
          codigo1: (data.codigo1 || '').toLowerCase().trim(),
          codigo2: (data.codigo2 || '').toLowerCase().trim(),
          severidade: data.severidade || 'Moderada',
          descricao: data.descricao || 'Sem descrição',
          recomendacao: data.recomendacao || ''
        });
      })
      .on('end', () => resolve(baseInteracoes))
      .on('error', reject);
  });
};

// Carregar base ao inicializar o módulo
carregarBaseInteracoes().catch(err => {
  console.error('Erro ao carregar base de interações:', err);
});

module.exports = {
  analisar: (prescricoes) => {
    const prescricoesAgrupadas = {};

    // Agrupar medicamentos por prescrição
    prescricoes.forEach(p => {
      if (!prescricoesAgrupadas[p.numero_prescricao]) {
        prescricoesAgrupadas[p.numero_prescricao] = [];
      }
      prescricoesAgrupadas[p.numero_prescricao].push({
        nome: (p.nome_medicamento || '').toLowerCase().trim(),
        codigo: (p.codigo_medicamento || '').toLowerCase().trim()
      });
    });

    const prescricoesComInteracoes = [];
    let totalInteracoes = 0;

    // Analisar cada prescrição
    Object.entries(prescricoesAgrupadas).forEach(([numeroPrescricao, medicamentos]) => {
      const interacoes = [];
      let severidadeMaxima = 'Nenhuma';

      // Comparar cada par de medicamentos
      for (let i = 0; i < medicamentos.length; i++) {
        for (let j = i + 1; j < medicamentos.length; j++) {
          const med1 = medicamentos[i];
          const med2 = medicamentos[j];

          // Procurar na base de interações
          const interacao = baseInteracoes.find(inter => {
            const match1 = (
              (inter.medicamento1 === med1.nome || inter.codigo1 === med1.codigo) &&
              (inter.medicamento2 === med2.nome || inter.codigo2 === med2.codigo)
            );
            const match2 = (
              (inter.medicamento2 === med1.nome || inter.codigo2 === med1.codigo) &&
              (inter.medicamento1 === med2.nome || inter.codigo1 === med2.codigo)
            );
            return match1 || match2;
          });

          if (interacao) {
            interacoes.push({
              medicamento1: med1.nome || med1.codigo,
              medicamento2: med2.nome || med2.codigo,
              severidade: interacao.severidade,
              descricao: interacao.descricao,
              recomendacao: interacao.recomendacao
            });

            // Atualizar severidade máxima
            const nivelSeveridade = {
              'Crítica': 4,
              'Grave': 3,
              'Moderada': 2,
              'Leve': 1,
              'Nenhuma': 0
            };
            if (nivelSeveridade[interacao.severidade] > nivelSeveridade[severidadeMaxima]) {
              severidadeMaxima = interacao.severidade;
            }
          }
        }
      }

      // Se houver interações, adicionar à lista
      if (interacoes.length > 0) {
        prescricoesComInteracoes.push({
          numero_prescricao: numeroPrescricao,
          medicamentos: medicamentos.map(m => m.nome || m.codigo),
          interacoes: interacoes,
          severidade_maxima: severidadeMaxima
        });
        totalInteracoes += interacoes.length;
      }
    });

    return {
      total_prescricoes: Object.keys(prescricoesAgrupadas).length,
      prescricoes_com_interacoes: prescricoesComInteracoes,
      prescricoes_sem_interacoes: Object.keys(prescricoesAgrupadas).length - prescricoesComInteracoes.length,
      total_interacoes: totalInteracoes,
      data_analise: new Date().toISOString()
    };
  },

  recarregarBase: () => {
    baseInteracoes = [];
    return carregarBaseInteracoes();
  }
};
