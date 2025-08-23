# Guia de Estilo

## 📝 Convenções de Código

### Nomenclatura

#### JavaScript/TypeScript
- **Variáveis**: camelCase
```typescript
const userName = 'John';
let isActive = true;
```

- **Constantes**: UPPER_SNAKE_CASE
```typescript
const MAX_RETRIES = 3;
const API_ENDPOINT = '/api/v1';
```

- **Funções**: camelCase
```typescript
function calculateTotal() {}
const getUserData = () => {};
```

- **Classes**: PascalCase
```typescript
class UserService {}
interface UserData {}
```

- **Tipos**: PascalCase
```typescript
type UserRole = 'admin' | 'user';
interface UserProfile {}
```

#### Vue Components
- **Componentes**: PascalCase
```vue
<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <!-- ... -->
  </div>
</template>
```

- **Props**: camelCase
```typescript
props: {
  userName: String,
  isActive: Boolean
}
```

### Formatação

#### Indentação
- Use 2 espaços para indentação
- Não use tabs

#### Linhas
- Máximo de 80 caracteres por linha
- Use quebras de linha para melhor legibilidade

#### Espaçamento
- Use espaço após vírgulas
- Use espaço após operadores
- Não use espaço após parênteses de abertura
- Não use espaço antes de parênteses de fechamento

```typescript
// Bom
function calculate(a, b) {
  return a + b;
}

// Ruim
function calculate( a,b ){
  return a+b;
}
```

### Comentários

#### Documentação
- Use JSDoc para funções e classes
- Documente parâmetros e retornos

```typescript
/**
 * Calcula o total de um pedido
 * @param {number} subtotal - Valor subtotal
 * @param {number} tax - Taxa de imposto
 * @returns {number} Total do pedido
 */
function calculateTotal(subtotal: number, tax: number): number {
  return subtotal * (1 + tax);
}
```

#### Comentários de Código
- Use comentários para explicar lógica complexa
- Mantenha comentários atualizados
- Evite comentários óbvios

```typescript
// Bom
// Verifica se o usuário tem permissão de admin
if (user.role === 'admin') {
  // ...
}

// Ruim
// Incrementa o contador
counter++;
```

## 🎨 Estilo Visual

### Cores
- Use variáveis CSS para cores
- Mantenha consistência na paleta

```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5a623;
  --text-color: #333333;
  --background-color: #ffffff;
}
```

### Tipografia
- Use fontes do sistema
- Defina tamanhos consistentes
- Use hierarquia clara

```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-small: 14px;
  --font-size-large: 18px;
}
```

### Espaçamento
- Use múltiplos de 8px para espaçamento
- Mantenha consistência

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

## 🛠️ Boas Práticas

### Vue.js
- Use Composition API
- Mantenha componentes pequenos
- Use props para comunicação
- Evite manipulação direta do DOM

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title: string
  count: number
}>()

const formattedCount = computed(() => {
  return props.count.toLocaleString()
})
</script>
```

### TypeScript
- Use tipos explícitos
- Evite any
- Use interfaces para objetos
- Use enums para constantes

```typescript
enum UserRole {
  Admin = 'admin',
  User = 'user'
}

interface User {
  id: string
  name: string
  role: UserRole
}
```

### CSS
- Use BEM para nomenclatura
- Evite !important
- Use variáveis CSS
- Mantenha especificidade baixa

```css
.user-card {
  &__header {
    /* ... */
  }
  
  &__content {
    /* ... */
  }
  
  &--active {
    /* ... */
  }
}
```

## 📚 Documentação

### Componentes
- Documente props
- Documente eventos
- Documente slots
- Inclua exemplos

```vue
<!-- 
  @component UserCard
  @description Card de usuário com informações básicas
  @prop {string} name - Nome do usuário
  @prop {string} role - Papel do usuário
  @event click - Disparado ao clicar no card
  @slot default - Conteúdo adicional
-->
```

### Funções
- Documente parâmetros
- Documente retorno
- Documente exceções
- Inclua exemplos

```typescript
/**
 * @function calculateTotal
 * @description Calcula o total de um pedido
 * @param {number} subtotal - Valor subtotal
 * @param {number} tax - Taxa de imposto
 * @returns {number} Total do pedido
 * @throws {Error} Se subtotal for negativo
 * @example
 * const total = calculateTotal(100, 0.1) // 110
 */
```

## 🔍 Linting e Formatação

### ESLint
- Use regras estritas
- Mantenha configuração atualizada
- Corrija warnings

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Prettier
- Use configuração consistente
- Integre com ESLint
- Formate automaticamente

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

## 🤝 Contribuição

### Commits
- Use mensagens claras
- Siga o padrão Conventional Commits
- Referencie issues

```bash
git commit -m "feat: adiciona sistema de autenticação

- Implementa login com JWT
- Adiciona middleware de autenticação
- Atualiza documentação

Closes #123"
```

### Pull Requests
- Descreva mudanças
- Referencie issues
- Inclua screenshots quando necessário
- Mantenha PRs pequenos

```markdown
## Descrição
Adiciona sistema de autenticação com JWT

## Mudanças
- Implementa login com JWT
- Adiciona middleware de autenticação
- Atualiza documentação

## Screenshots
![Login Screen](screenshot.png)

## Issues Relacionadas
Closes #123
``` 