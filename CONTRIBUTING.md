# Contribuindo

Obrigado por considerar contribuir para o projeto!

## Diretrizes

### 1. Fork o Repositório

```bash
git clone https://github.com/SEU_USERNAME/prescricao-medicamentosa.git
cd prescricao-medicamentosa
```

### 2. Criar uma Branch

```bash
git checkout -b feature/sua-feature
```

### 3. Fazer Commits

Use mensagens de commit claras:

```bash
git commit -m "Add: descrição da feature"
git commit -m "Fix: descrição do bug"
git commit -m "Docs: descrição da documentação"
```

### 4. Push e Pull Request

```bash
git push origin feature/sua-feature
```

Crie um Pull Request explicando suas mudanças.

---

## Padrões de Código

### JavaScript/React
- Use `const` por padrão, `let` quando necessário
- Nomes de componentes em PascalCase
- Nomes de variáveis/funções em camelCase
- Adicione comentários em lógica complexa
- Use arrow functions

### Exemplo

```javascript
// ✅ Bom
const UserProfile = ({ user }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica aqui
  };

  return <div>...</div>;
};

// ❌ Evitar
function user_profile(props) {
  function handle_submit() {
    // lógica aqui
  }
}
```

---

## Tipos de Contribuição

### 🐛 Reportar Bugs

Descreva:
1. Passos para reproduzir
2. Comportamento esperado
3. Comportamento atual
4. Versão do Node.js

### ✨ Sugerir Features

Descreva:
1. O problema que resolve
2. Solução proposta
3. Alternativas consideradas

### 📚 Melhorar Documentação

- Corrija typos
- Adicione exemplos
- Melhore clareza

### 🔧 Refatorar Código

- Melhore performance
- Reduza complexidade
- Melhore legibilidade

---

## Checklist antes de enviar PR

- [ ] Código segue os padrões do projeto
- [ ] Testei a funcionalidade localmente
- [ ] Atualizei a documentação
- [ ] Não há console.log ou código comentado
- [ ] Commit messages são claras
- [ ] Sem conflitos com a branch main

---

## Perguntas?

Abra uma Issue com a tag `question`.

Obrigado! 🎉
