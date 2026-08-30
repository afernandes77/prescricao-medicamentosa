# Base de Dados e Arquivos de Exemplo

Este diretório contém:

## `interacoes_meds.csv`
Base de dados completa de interações medicamentosas em português com:
- Nome dos medicamentos
- Código ATC
- Severidade (Crítica, Grave, Moderada, Leve)
- Descrição da interação
- Recomendações clinicamente relevantes

## `exemplo_prescricoes.csv`
Arquivo de exemplo para teste da aplicação com:
- Prescrito com 5 pacientes
- Alguns com interações leves a graves
- Formato correto para upload

## `exemplo_prescricoes_criticas.csv`
Arquivo com exemplos de interações críticas:
- Ibuprofeno + Dipirona + Naproxeno (3 AINEs associados)
- Amitriptilina + Álcool
- Digoxina + Espironolactona

---

### Como usar:

1. Use `exemplo_prescricoes.csv` para teste inicial
2. Use `exemplo_prescricoes_criticas.csv` para testar alertas severos
3. Crie suas próprias planilhas seguindo o mesmo formato

### Formato obrigatório:

```csv
numero_prescricao,codigo_medicamento,nome_medicamento
RX-001,ATC-001,Medicamento 500mg
```
