const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data/database.db');

// Criar diretório de dados se não existir
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Inicializar banco de dados
db.serialize(() => {
  // Tabela de planilhas
  db.run(`
    CREATE TABLE IF NOT EXISTS planilhas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
      nome_arquivo TEXT
    )
  `);

  // Tabela de prescrições
  db.run(`
    CREATE TABLE IF NOT EXISTS prescricoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planilha_id INTEGER,
      numero_prescricao TEXT,
      codigo_medicamento TEXT,
      nome_medicamento TEXT,
      FOREIGN KEY (planilha_id) REFERENCES planilhas(id)
    )
  `);

  // Tabela de medicamentos (cache)
  db.run(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE,
      nome TEXT,
      principio_ativo TEXT
    )
  `);
});

module.exports = {
  salvarPlanilha: (prescricoes, nomeArquivo = 'planilha.xlsx') => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO planilhas (nome_arquivo) VALUES (?)',
        [nomeArquivo],
        function(err) {
          if (err) return reject(err);
          const planilhaId = this.lastID;

          // Salvar prescrições
          const stmt = db.prepare(
            'INSERT INTO prescricoes (planilha_id, numero_prescricao, codigo_medicamento, nome_medicamento) VALUES (?, ?, ?, ?)'
          );

          prescricoes.forEach(p => {
            stmt.run(
              planilhaId,
              p.numero_prescricao,
              p.codigo_medicamento || null,
              p.nome_medicamento
            );
          });

          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve(planilhaId);
          });
        }
      );
    });
  },

  obterPlanilha: (id) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM prescricoes WHERE planilha_id = ?',
        [id],
        (err, rows) => {
          if (err) return reject(err);
          resolve({
            prescricoes: rows,
            data_upload: new Date()
          });
        }
      );
    });
  },

  listarMedicamentos: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM medicamentos', (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  },

  buscarMedicamento: (termo) => {
    return new Promise((resolve, reject) => {
      const searchTerm = `%${termo}%`;
      db.all(
        'SELECT * FROM medicamentos WHERE nome LIKE ? OR codigo LIKE ?',
        [searchTerm, searchTerm],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  close: () => {
    db.close();
  }
};
