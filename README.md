# Saucedemo - Testes Automatizados com Cypress e Qase

Projeto de automação de testes para o site [Saucedemo](https://www.saucedemo.com) usando **Cypress** e integração com **Qase** para gerenciamento de resultados.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **npm** (vem com Node.js)
- **Git** (opcional, para clonar o repositório)

### Verificar versões instaladas:

```powershell
node --version
npm --version
```

---

## 🚀 Instalação

### 1. Clonar ou baixar o projeto

Se você tem Git instalado:
```powershell
git clone <URL-DO-REPOSITORIO>
cd saucedemo-qase-cypress
```

Ou download manual do arquivo `.zip` e descompacte em uma pasta.

### 2. Instalar dependências

Abra o terminal (PowerShell no Windows) na pasta do projeto e execute:

```powershell
npm install
```

Isso instalará todos os pacotes necessários:
- **Cypress** - Framework de testes
- **dotenv** - Gerenciador de variáveis de ambiente
- **fast-xml-parser** - Parser de XML para resultados dos testes
- **mocha-junit-reporter** - Gerador de relatórios JUnit
- **axios** - Cliente HTTP para comunicação com API Qase

---

## ⚙️ Configuração

### 1. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com as seguintes variáveis:

```env
QASE_API_TOKEN=seu_token_aqui
QASE_PROJECT_CODE=SAUCE
QASE_API_BASE_URL=https://api.qase.io/v1
QASE_RUN_TITLE=Teste Local - Cypress
```

**Como obter o `QASE_API_TOKEN`:**
1. Acesse [Qase.io](https://qase.io)
2. Faça login ou crie uma conta
3. Vá para **Settings** > **API Tokens**
4. Gere um novo token e copie

**O que significa cada variável:**
- `QASE_API_TOKEN` - Token de autenticação da API Qase
- `QASE_PROJECT_CODE` - Código do projeto no Qase (padrão: SAUCE)
- `QASE_API_BASE_URL` - URL base da API Qase (manter como está)
- `QASE_RUN_TITLE` - Título do run de testes no Qase

### 2. Verificar configuração (Opcional)

Abra o arquivo `cypress.config.js` para ver a configuração:
```javascript
baseUrl: "https://www.saucedemo.com" // URL do site a testar
```

---

## 📝 Executar os Testes

### Opção 1: Interface Visual do Cypress (Recomendado para desenvolvimento)

```powershell
npm run cy:open
```

Isso abre a interface gráfica do Cypress onde você pode:
- Visualizar todos os testes disponíveis
- Rodar testes individualmente ou em grupo
- Ver a execução em tempo real
- Inspecionar elementos da página

### Opção 2: Testes de Autenticação (Headless)

```powershell
npm run cy:run:auth
```

Executa apenas os testes de autenticação:
- [SAUCE-1] Login com credenciais válidas
- [SAUCE-2] Rejeitar senha inválida
- [SAUCE-3] Rejeitar usuário inexistente
- [SAUCE-4] Bloquear usuário locked_out_user
- [SAUCE-5] Validar obrigatoriedade do Username
- [SAUCE-6] Validar obrigatoriedade da Password
- [SAUCE-7] Validar obrigatoriedade de Username e Password
- [SAUCE-8] Logout
- [SAUCE-9] Impedir acesso direto ao inventário

### Opção 3: Testes de Inventário (Headless)

```powershell
npm run cy:run:inventory
```

Executa apenas os testes de inventário:
- [SAUCE-10] Exibir listagem de produtos
- [SAUCE-11] Validar informações do card do produto
- [SAUCE-12] Abrir detalhes ao clicar no nome
- [SAUCE-13] Abrir detalhes ao clicar na imagem
- [SAUCE-14] Botão "Back to products" retorna à listagem
- [SAUCE-15] Ordenar por nome (A to Z)
- [SAUCE-16] Ordenar por nome (Z to A)
- [SAUCE-17] Ordenar por preço (low to high)
- [SAUCE-18] Ordenar por preço (high to low)
- [SAUCE-19] Adicionar produto ao carrinho
- [SAUCE-20] Remover produto do carrinho
- [SAUCE-21] Badge incrementa ao adicionar múltiplos
- [SAUCE-22] Badge decrementa ao remover
- [SAUCE-23] Estado do botão persiste após navegar

### Opção 4: Todos os Testes (Headless)

```powershell
npm run cy:run:all
```

Executa todos os testes (autenticação + inventário).

---

## 📤 Upload dos Resultados para Qase

Após executar os testes, você pode fazer upload dos resultados para o Qase:

### Opção 1: Autenticação + Upload para Qase

```powershell
npm run test:auth:qase
```

Executa testes de autenticação e faz upload dos resultados para o Qase.

### Opção 2: Inventário + Upload para Qase

```powershell
npm run test:inventory:qase
```

Executa testes de inventário e faz upload dos resultados para o Qase.

### Opção 3: Todos os Testes + Upload para Qase

```powershell
npm run test:all:qase
```

Executa todos os testes e faz upload dos resultados para o Qase.

### Opção 4: Upload Manual

Se você já executou os testes e quer fazer upload manualmente:

```powershell
npm run qase:upload
```

---

## 🤖 GitHub Actions + Qase (CI/CD)

O projeto está configurado com **GitHub Actions** para automação completa!

### ✨ O que acontece automaticamente:

✅ **A cada push** para `main` ou `develop`:
1. Testes executam no GitHub Actions
2. Resultados são enviados para Qase automaticamente
3. Relatórios aparecem em **Actions** e **Qase.io**

✅ **Diariamente** às 8h UTC:
- Execução automática de todos os testes
- Monitoramento contínuo da qualidade

### 🔧 Como Configurar GitHub Actions

Siga o guia completo em: [`.github/GITHUB_ACTIONS_SETUP.md`](./.github/GITHUB_ACTIONS_SETUP.md)

**Resumo rápido:**

1. Obtenha seu token do Qase
2. Adicione como GitHub Secret: `QASE_API_TOKEN`
3. Faça um push para `main`
4. Veja a magia acontecer em **Actions** → **Cypress Tests - Automation Suite**

### 📊 Visualizar Resultados

**No GitHub:**
- Vá para **Actions** > **Cypress Tests - Automation Suite**
- Clique em um workflow para ver detalhes

**No Qase:**
- Acesse seu projeto SAUCE
- Vá para **Runs** para ver todos os resultados

### 📈 Fluxo Visual

Veja o diagrama completo em: [`.github/INTEGRATION_FLOW.md`](./.github/INTEGRATION_FLOW.md)

---

## 📁 Estrutura do Projeto

```
saucedemo-qase-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   └── auth.cy.js           # Testes de autenticação
│   │   └── inventory/
│   │       └── inventory.cy.js       # Testes de inventário
│   ├── fixtures/
│   │   └── example.json              # Dados de teste
│   ├── results/
│   │   └── junit-*.xml               # Relatórios de testes (gerados automaticamente)
│   ├── screenshots/                  # Screenshots em caso de falha
│   ├── support/
│   │   ├── e2e.js                   # Configuração geral
│   │   └── commands/
│   │       ├── login.js              # Comando customizado de login
│   │       ├── login-validations.js  # Validações de login
│   │       └── logout.js             # Comando customizado de logout
├── scripts/
│   └── qase-upload.js                # Script para upload dos resultados no Qase
├── cypress.config.js                 # Configuração do Cypress
├── package.json                      # Dependências do projeto
├── .env                              # Variáveis de ambiente (criar)
└── README.md                         # Este arquivo
```

---

## 🧪 Detalhes dos Testes

### Dados de Login

Os testes usam os seguintes usuários disponíveis no Saucedemo:

| Usuário | Senha | Status |
|---------|-------|--------|
| `standard_user` | `secret_sauce` | ✅ Válido |
| `locked_out_user` | `secret_sauce` | 🔒 Bloqueado |
| `problem_user` | `secret_sauce` | ⚠️ Usuário problemático |
| `performance_glitch_user` | `secret_sauce` | ⚠️ Performance lenta |

### Estrutura de um Teste

Cada teste segue este padrão:

```javascript
it('[SAUCE-N] Descrição do teste', () => {
    // Setup - Preparação
    cy.login('standard_user', 'secret_sauce');
    
    // Ação - O que você está testando
    cy.get('.inventory_list').should('be.visible');
    
    // Validação - Asserção esperada
    cy.get('.inventory_item').should('have.length.at.least', 1);
});
```

---

## 🐛 Troubleshooting

### Erro: "Missing env var: QASE_API_TOKEN"

**Solução:** Crie o arquivo `.env` na raiz do projeto com o token válido.

```env
QASE_API_TOKEN=seu_token_valido
```

### Erro: "No JUnit XML found in cypress/results"

**Solução:** Execute primeiro os testes antes de fazer upload:

```powershell
npm run cy:run:all
```

Isso gera os arquivos XML necessários.

### Erro: "Cannot find module 'cypress'"

**Solução:** Instale as dependências novamente:

```powershell
npm install
```

### Testes falhando no login

**Solução:** 
1. Verifique se a URL do site está acessível: https://www.saucedemo.com
2. Tente acessar manualmente o site
3. Verifique se o usuário `standard_user` está ativo no Saucedemo

### Timeout nos testes

**Solução:** Os testes têm timeout de 10 segundos por padrão. Se sua conexão for lenta:

1. Abra `cypress.config.js`
2. Aumente o valor de `defaultCommandTimeout`

```javascript
e2e: {
    defaultCommandTimeout: 15000, // 15 segundos
    baseUrl: "https://www.saucedemo.com",
}
```

---

## 📊 Visualizar Resultados

### No Terminal

Após executar os testes, você verá um resumo no terminal:

```
Tests:        23
Passing:      23
Failing:      0
Duration:     20 seconds
```

### No Qase

1. Acesse [Qase.io](https://qase.io)
2. Navegue até seu projeto (SAUCE)
3. Clique em **Runs**
4. Você verá os resultados dos testes enviados

### Arquivos XML

Os resultados em XML estão em:
```
cypress/results/junit-*.xml
```

---

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run cy:open` | Abre interface gráfica do Cypress |
| `npm run cy:run:auth` | Executa testes de autenticação |
| `npm run cy:run:inventory` | Executa testes de inventário |
| `npm run cy:run:all` | Executa todos os testes |
| `npm run qase:upload` | Faz upload manual dos resultados |
| `npm run test:auth:qase` | Roda auth + upload para Qase |
| `npm run test:inventory:qase` | Roda inventory + upload para Qase |
| `npm run test:all:qase` | Roda todos + upload para Qase |

---

## 📚 Recursos Adicionais

- [Documentação Cypress](https://docs.cypress.io)
- [Documentação Qase.io](https://docs.qase.io)
- [Saucedemo - Site de teste](https://www.saucedemo.com)
- [Node.js - Download](https://nodejs.org/)

---

## 💡 Dicas

1. **Use `npm run cy:open` durante desenvolvimento** - Mais fácil debugar
2. **Mantenha o arquivo `.env` seguro** - Não compartilhe seu token Qase
3. **Verifique conexão de internet** - Testes precisam acessar www.saucedemo.com
4. **Execute testes regularmente** - Ajuda a identificar regressões

---

## 📝 Próximos Passos

Após rodar os testes com sucesso:

1. ✅ Verifique os resultados no terminal
2. ✅ Acesse Qase.io para visualizar os detalhes
3. ✅ Adicione mais testes conforme necessário
4. ✅ Configure CI/CD para rodar automaticamente

---

## 🆘 Suporte

Se você tiver dúvidas ou problemas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que Node.js e npm estão instalados
3. Tente executar `npm install` novamente
4. Verifique a conexão com internet

---

**Versão:** 1.0.0  
**Último update:** Janeiro 2026  
**Mantido por:** Uelton Gomes
