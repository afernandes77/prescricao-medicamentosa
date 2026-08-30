const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../services/database');
const analisadorInteracoes = require('../services/analisadorInteracoes');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST - Upload de planilha com prescrições
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo foi enviado' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    let prescricoes = [];

    // Processar Excel
    if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      prescricoes = data;
    }
    // Processar CSV
    else if (fileExtension === '.csv') {
      prescricoes = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
    } else {
      return res.status(400).json({ erro: 'Formato de arquivo não suportado' });
    }

    // Validar dados
    const prescricoesValidas = prescricoes.filter(p => 
      p.numero_prescricao && (p.codigo_medicamento || p.nome_medicamento)
    );

    if (prescricoesValidas.length === 0) {
      return res.status(400).json({ erro: 'Nenhuma prescrição válida encontrada' });
    }

    // Salvar no banco de dados e obter ID
    const idPlanilha = db.salvarPlanilha(prescricoesValidas);

    // Analisar interações
    const analise = analisadorInteracoes.analisar(prescricoesValidas);

    // Limpar arquivo temporário
    fs.unlinkSync(filePath);

    res.json({
      sucesso: true,
      id_planilha: idPlanilha,
      total_prescricoes: prescricoesValidas.length,
      analise: analise
    });
  } catch (erro) {
    console.error('Erro ao processar arquivo:', erro);
    res.status(500).json({ erro: 'Erro ao processar arquivo', detalhes: erro.message });
  }
});

// GET - Obter análise de uma planilha
router.get('/:id/analise', (req, res) => {
  try {
    const { id } = req.params;
    const dados = db.obterPlanilha(id);

    if (!dados) {
      return res.status(404).json({ erro: 'Planilha não encontrada' });
    }

    const analise = analisadorInteracoes.analisar(dados.prescricoes);

    res.json({
      id_planilha: id,
      total_prescricoes: dados.prescricoes.length,
      data_upload: dados.data_upload,
      analise: analise
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao obter análise', detalhes: erro.message });
  }
});

// GET - Exportar resultado em Excel
router.get('/:id/exportar/excel', async (req, res) => {
  try {
    const { id } = req.params;
    const dados = db.obterPlanilha(id);

    if (!dados) {
      return res.status(404).json({ erro: 'Planilha não encontrada' });
    }

    const analise = analisadorInteracoes.analisar(dados.prescricoes);
    const workbook = new ExcelJS.Workbook();

    // Aba 1: Resumo de Interações
    const resumoSheet = workbook.addWorksheet('Resumo');
    resumoSheet.columns = [
      { header: 'Prescrição', key: 'prescricao', width: 15 },
      { header: 'Medicamentos', key: 'medicamentos', width: 30 },
      { header: 'Interações Encontradas', key: 'interacoes_count', width: 20 },
      { header: 'Severidade', key: 'severidade', width: 15 },
      { header: 'Observações', key: 'observacoes', width: 40 }
    ];

    analise.prescricoes_com_interacoes.forEach(item => {
      resumoSheet.addRow({
        prescricao: item.numero_prescricao,
        medicamentos: item.medicamentos.join(', '),
        interacoes_count: item.interacoes.length,
        severidade: item.severidade_maxima,
        observacoes: item.interacoes.map(i => i.descricao).join('; ')
      });
    });

    // Aba 2: Detalhes das Interações
    const detalhesSheet = workbook.addWorksheet('Detalhes');
    detalhesSheet.columns = [
      { header: 'Prescrição', key: 'prescricao', width: 15 },
      { header: 'Medicamento 1', key: 'med1', width: 20 },
      { header: 'Medicamento 2', key: 'med2', width: 20 },
      { header: 'Severidade', key: 'severidade', width: 15 },
      { header: 'Descrição', key: 'descricao', width: 50 },
      { header: 'Recomendação', key: 'recomendacao', width: 40 }
    ];

    analise.prescricoes_com_interacoes.forEach(item => {
      item.interacoes.forEach(inter => {
        detalhesSheet.addRow({
          prescricao: item.numero_prescricao,
          med1: inter.medicamento1,
          med2: inter.medicamento2,
          severidade: inter.severidade,
          descricao: inter.descricao,
          recomendacao: inter.recomendacao || 'N/A'
        });
      });
    });

    // Enviar arquivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="interacoes_medicamentosas.xlsx"');
    await workbook.xlsx.write(res);
  } catch (erro) {
    console.error('Erro ao exportar Excel:', erro);
    res.status(500).json({ erro: 'Erro ao exportar', detalhes: erro.message });
  }
});

// GET - Exportar resultado em PDF
router.get('/:id/exportar/pdf', (req, res) => {
  try {
    const { id } = req.params;
    const dados = db.obterPlanilha(id);

    if (!dados) {
      return res.status(404).json({ erro: 'Planilha não encontrada' });
    }

    const analise = analisadorInteracoes.analisar(dados.prescricoes);
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="interacoes_medicamentosas.pdf"');

    doc.pipe(res);

    // Título
    doc.fontSize(20).font('Helvetica-Bold').text('Relatório de Interações Medicamentosas', { align: 'center' });
    doc.fontSize(10).text(`Data: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });
    doc.moveDown();

    // Resumo geral
    doc.fontSize(12).font('Helvetica-Bold').text('Resumo Geral');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total de prescrições: ${analise.total_prescricoes}`);
    doc.text(`Prescrições com interações: ${analise.prescricoes_com_interacoes.length}`);
    doc.text(`Total de interações: ${analise.total_interacoes}`);
    doc.moveDown();

    // Detalhes por prescrição
    doc.fontSize(12).font('Helvetica-Bold').text('Detalhes por Prescrição');
    doc.moveDown(0.5);

    analise.prescricoes_com_interacoes.forEach(item => {
      doc.fontSize(11).font('Helvetica-Bold').text(`Prescrição: ${item.numero_prescricao}`);
      doc.fontSize(10).font('Helvetica').text(`Medicamentos: ${item.medicamentos.join(', ')}`);
      doc.text(`Severidade Máxima: ${item.severidade_maxima}`);
      doc.text(`Interações encontradas: ${item.interacoes.length}`);

      item.interacoes.forEach(inter => {
        doc.text(`  • ${inter.medicamento1} + ${inter.medicamento2}: ${inter.descricao}`);
      });

      doc.moveDown(0.5);
    });

    doc.end();
  } catch (erro) {
    console.error('Erro ao exportar PDF:', erro);
    res.status(500).json({ erro: 'Erro ao exportar', detalhes: erro.message });
  }
});

module.exports = router;
