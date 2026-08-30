# Verificador de Interações Medicamentosas - MedCheck

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4-lightgrey)](https://expressjs.com)

## 🏥 Sobre

**MedCheck** é uma aplicação web desenvolvida para farmacêuticos, médicos e profissionais de saúde que permite:

- 📋 Upload de planilhas com prescrições de pacientes
- 🔍 Análise automática de interações medicamentosas
- 📄 Exportação de relatórios (Excel, PDF, CSV)
- ⚠️ Alertas de severidade das interações
- 📚 Base de dados completa de interações em português

---

## ✨ Funcionalidades Principais

### Upload e Processamento
- ✅ Suporte para Excel (.xlsx, .xls) e CSV
- ✅ Validação automática de dados
- ✅ Processamento em tempo real
- ✅ Limite de tamanho: 10MB

### Análise de Interações
- ✅ Comparação automática entre medicamentos
- ✅ Classificação por severidade:
  - 🔴 **Crítica** - Evitar associação
  - 🟠 **Grave** - Monitorar rigorosamente
  - 🟡 **Moderada** - Atenção especial
  - 🔵 **Leve** - Possibilidade de uso
- ✅ Recomendações clínicas

### Exportação
- 📊 **Excel**: Planilha formatada com resumo e detalhes
- 📄 **PDF**: Relatório impresso com logo e data
- 📋 **CSV**: Dados em formato bruto

---

## 🚀 Quick Start

### Requisitos
- Node.js 16+
- npm ou yarn
- Docker (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/afernandes77/prescricao-medicamentosa.git
cd prescricao-medicamentosa

# Opção 1: Executar localmente
cd backend && npm install && npm start
# Em outro terminal
cd frontend && npm install && npm start

# Opção 2: Docker (recomendado)
docker-compose up
```

Acesse: **http://localhost:3000**

---

## 📊 Estrutura de Arquivos

```
prescricao-medicamentosa/
├── backend/                          # API Node.js/Express
│   ├── routes/
│   │   ├── prescricoes.js           # Rotas de prescrições
│   │   └── medicamentos.js          # Rotas de medicamentos
│   ├── services/
│   │   ├── database.js              # Banco de dados
│   │   └── analisadorInteracoes.js  # Lógica de análise
│   ├── server.js                    # Servidor principal
│   └── package.json
│
├── frontend/                         # Interface React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── UploadArea.js
│   │   │   └── ResultadosAnalise.js
│   │   ├── pages/
│   │   │   ├── UploadPage.js
│   │   │   └── ResultadosPage.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── data/                             # Base de dados
│   ├── interacoes_meds.csv          # 48+ interações
│   ├── exemplo_prescricoes.csv
│   └── exemplo_prescricoes_criticas.csv
│
├── docker-compose.yml
├── INSTALL.md                        # Guia de instalação
├── CONTRIBUTING.md                   # Guia de contribuição
└── README.md
```

---

## 📋 Formato de Entrada

Sua planilha deve ter estas colunas:

| numero_prescricao | codigo_medicamento | nome_medicamento |
|-------------------|-------------------|------------------|
| RX-001           | ATC-001          | Dipirona 500mg   |
| RX-001           | ATC-002          | Amoxicilina 500mg|
| RX-002           | ATC-003          | Ibuprofeno 400mg |

**Obrigatório**: `numero_prescricao` e `nome_medicamento`

---

## 📊 Base de Dados de Interações

A aplicação inclui um banco de dados com **48+ interações medicamentosas**, incluindo:

- Analgésicos
- Antibióticos
- Antihipertensivos
- Anticoagulantes
- Antifibrinolíticos
- Antifarmacéuticos
- Anticonvulsionantes
- Antidepressívos
- E muitos outros...

Cada interação inclui:
- Severidade
- Descrição detalhada
- Recomendações clínicas

---

## 💪 API Endpoints

### POST - Upload de Planilha
```http
POST /api/prescricoes/upload
Content-Type: multipart/form-data

Body: file (Excel ou CSV)
```

**Resposta:**
```json
{
  "sucesso": true,
  "id_planilha": 1,
  "total_prescricoes": 5,
  "analise": {
    "total_prescricoes": 5,
    "prescricoes_com_interacoes": [...],
    "total_interacoes": 3
  }
}
```

### GET - Obter Análise
```http
GET /api/prescricoes/:id/analise
```

### GET - Exportar (Excel/PDF/CSV)
```http
GET /api/prescricoes/:id/exportar/excel
GET /api/prescricoes/:id/exportar/pdf
GET /api/prescricoes/:id/exportar/csv
```

---

## 📱 Stack Tecnológico

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Multer** - Upload de arquivos
- **SQLite3** - Banco de dados
- **ExcelJS** - Geração de Excel
- **PDFKit** - Geração de PDF

### Frontend
- **React 18** - Interface
- **React Router** - Navegação
- **Axios** - HTTP cliente
- **Tailwind CSS** - Estilos
- **React Icons** - Ícones
- **React Dropzone** - Upload por drag-and-drop

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração

---

## 🚀 Deploy

### Opção 1: Docker (Recomendado)
```bash
docker-compose up -d
```

### Opção 2: Heroku
```bash
heroku create seu-app
git push heroku main
```

### Opção 3: Vercel (Frontend)
```bash
cd frontend
vercel
```

---

## 📚 Documentação

- [Guia de Instalação](INSTALL.md)
- [Guia de Contribuição](CONTRIBUTING.md)
- [Checklist de Desenvolvimento](DEVELOPMENT.md)

---

## 🚧 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./data.db
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📆 Exemplos de Uso

### Teste 1: Interações Leves
```bash
Upload: data/exemplo_prescricoes.csv
```

### Teste 2: Interações Críticas
```bash
Upload: data/exemplo_prescricoes_criticas.csv
```

---

## 🐛 Troubleshooting

### Porta 5000 em uso
```bash
# Linux/Mac
lsof -i :5000 && kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Módulos não encontrados
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de banco de dados
```bash
chmod 755 data/
```

---

## 📝 Roadmap

- [x] Upload de prescrições
- [x] Análise de interações
- [x] Exportação em múltiplos formatos
- [ ] Autenticação de usuários
- [ ] Dashboard de estatísticas
- [ ] Integração com ANVISA
- [ ] Mobile app

---

## 🙋 Contribuindo

Ajudamos a melhorar! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

### Como contribuir:
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit suas mudanças: `git commit -m 'Add: descrição'`
4. Push para a branch: `git push origin feature/sua-feature`
5. Abra um Pull Request

---

## 📜 Licença

Este projeto é licenciado sob a MIT License - veja [LICENSE.md](LICENSE.md) para detalhes.

---

## 📞 Suporte

Tem dúvidas ou encontrou um problema?

- 🐤 Abra uma [Issue](https://github.com/afernandes77/prescricao-medicamentosa/issues)
- 💬 Discuta no [Discussions](https://github.com/afernandes77/prescricao-medicamentosa/discussions)
- 📗 Leia a [Documentação](INSTALL.md)

---

## 🌟 Agradecimentos

Obrigado por usar MedCheck! Se gostou, dê uma ⭐ no repositório.

---

**Desenvolvido com ❤️ por [Andrea C. Fernandes](https://github.com/afernandes77)**

*⚠️ Nota: Esta aplicação é uma ferramenta de auxílio e nunca substitui a avaliação profissional de farmacêuticos e médicos.*
