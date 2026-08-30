# Verificador de Interações Medicamentosas

Aplicação web para gerenciar prescrições de pacientes e identificar possíveis interações medicamentosas.

## Funcionalidades

✅ **Upload de planilhas** com múltiplas prescrições (Excel/CSV)
- Número da prescrição
- Código do medicamento
- Nome do medicamento

✅ **Base de dados** de interações medicamentosas

✅ **Análise automática** de interações entre medicamentos de cada prescrição

✅ **Exportação de resultados** (Excel/CSV/PDF)

## Estrutura do Projeto

```
├── backend/              # API Node.js/Express
├── frontend/             # Interface React
├── data/                 # Base de dados de medicamentos e interações
│   └── interacoes_meds.csv
├── docker-compose.yml
└── README.md
```

## Como Usar

### 1. Preparar a planilha de entrada

A planilha deve conter as seguintes colunas:

| numero_prescricao | codigo_medicamento | nome_medicamento |
|------------------|-------------------|------------------|
| RX-001           | ATC-001          | Dipirona 500mg   |
| RX-001           | ATC-002          | Amoxicilina 500mg|
| RX-002           | ATC-003          | Ibuprofeno 400mg |

### 2. Fazer upload na aplicação

- Acessar a interface web
- Fazer upload da planilha
- O sistema processará e identificará interações

### 3. Exportar resultados

- Os resultados serão exibidos em tempo real
- Opções de exportação: Excel, CSV ou PDF

## Tecnologias

- **Backend**: Node.js, Express, Multer
- **Frontend**: React, Axios, React Query
- **Banco de Dados**: SQLite / PostgreSQL
- **Exportação**: ExcelJS, PDFKit, csv-parser
- **Containerização**: Docker

## Instalação Rápida

```bash
# Clonar repositório
git clone https://github.com/afernandes77/prescricao-medicamentosa.git
cd prescricao-medicamentosa

# Instalar dependências
npm install

# Ou com Docker
docker-compose up -d
```

## API Endpoints

- `POST /api/prescricoes/upload` - Upload de planilha
- `GET /api/prescricoes/:id/analise` - Obter análise de interações
- `GET /api/prescricoes/:id/exportar` - Exportar resultado
- `GET /api/medicamentos` - Listar medicamentos cadastrados

## Status

🚀 Em desenvolvimento
