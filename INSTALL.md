# Guia de Instalação e Execução

## 📋 Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org))
- **npm** ou **yarn**
- **Docker** (opcional, para containerização)
- **Git**

---

## 🚀 Instalação Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/afernandes77/prescricao-medicamentosa.git
cd prescricao-medicamentosa
```

### 2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

### 4. Voltar à Raiz do Projeto

```bash
cd ..
```

---

## 🏃 Executar a Aplicação

### Opção 1: Executar Separadamente (Terminal duplo)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Aplicação rodando em http://localhost:3000
```

### Opção 2: Executar com Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📂 Estrutura de Diretórios

```
prescricao-medicamentosa/
├── backend/                    # API Node.js/Express
│   ├── routes/
│   │   ├── prescricoes.js      # Rotas de prescições
│   │   └── medicamentos.js     # Rotas de medicamentos
│   ├── services/
│   │   ├── database.js         # Gerenciamento do BD
│   │   └── analisadorInteracoes.js  # Lógica de análise
│   ├── uploads/                # Arquivos enviados
│   ├── server.js               # Servidor principal
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                   # Interface React
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
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── data/                       # Base de dados
│   ├── interacoes_meds.csv     # Base de interações
│   ├── exemplo_prescricoes.csv # Arquivo de teste
│   └── exemplo_prescricoes_criticas.csv
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🧪 Testando a Aplicação

### 1. Acessar o Frontend

Abra o navegador em: **http://localhost:3000**

### 2. Fazer Upload de um Arquivo de Teste

Use um dos arquivos de exemplo:
- `data/exemplo_prescricoes.csv` - Teste padrão
- `data/exemplo_prescricoes_criticas.csv` - Teste com interações críticas

### 3. Visualizar Resultados

Após o upload, você verá:
- ✅ Número de prescrições processadas
- 🔴 Prescrições com interações
- 🟢 Prescrições sem interações
- 📊 Detalhes de cada interação

### 4. Exportar Resultados

Clique em um dos botões para exportar:
- 📊 **Excel** (.xlsx)
- 📄 **PDF** (.pdf)
- 📋 **CSV** (.csv)

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./data.db
MAX_FILE_SIZE=10485760
```

---

## 📊 API Endpoints

### Upload de Planilha
```http
POST /api/prescricoes/upload
Content-Type: multipart/form-data

Body: file (arquivo Excel ou CSV)
```

**Resposta:**
```json
{
  "sucesso": true,
  "id_planilha": 1,
  "total_prescricoes": 5,
  "analise": { ... }
}
```

### Obter Análise
```http
GET /api/prescricoes/:id/analise
```

### Exportar em Excel
```http
GET /api/prescricoes/:id/exportar/excel
```

### Exportar em PDF
```http
GET /api/prescricoes/:id/exportar/pdf
```

### Listar Medicamentos
```http
GET /api/medicamentos
```

---

## 🐛 Troubleshooting

### "Port 5000 is already in use"
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Cannot find module"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### "Database error"
```bash
# Verificar permissões
chmod 755 data/
```

---

## 📝 Exemplo de Uso Completo

### 1. Criar planilha CSV

```csv
numero_prescricao,codigo_medicamento,nome_medicamento
RX-001,M01AE01,Ibuprofeno 400mg
RX-001,M01A-A14,Dipirona 500mg
RX-002,J01CA04,Amoxicilina 500mg
```

### 2. Fazer upload

- Acesse http://localhost:3000
- Arraste o arquivo ou clique para selecionar
- O sistema processará automaticamente

### 3. Analisar resultados

- Veja as interações encontradas
- Classifique por severidade
- Consulte as recomendações

### 4. Exportar relatório

- Clique em "Excel", "PDF" ou "CSV"
- Arquivo será baixado automaticamente

---

## 🚀 Deploy

### Deploy no Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-name

# Deploy
git push heroku main
```

### Deploy no Vercel (Frontend)

```bash
cd frontend
vercel
```

---

## 📚 Documentação Adicional

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Tailwind CSS](https://tailwindcss.com)

---

## 💡 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar banco de dados PostgreSQL
- [ ] Criar dashboard de análise
- [ ] Adicionar notificações por email
- [ ] Implementar sistema de cache
- [ ] Expandir base de dados de interações

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique a [página de Issues](https://github.com/afernandes77/prescricao-medicamentosa/issues)
2. Abra uma nova Issue com detalhes do problema
3. Consulte o README.md

---

## 📄 Licença

MIT License - Veja LICENSE.md para mais detalhes
