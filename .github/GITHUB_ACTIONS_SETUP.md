# 🔗 Integração GitHub Actions com Qase

Este documento explica como configurar e usar a integração automática entre GitHub Actions e Qase para upload de resultados de testes.

## 📋 Fluxo da Integração

```
GitHub Push
    ↓
GitHub Actions (tests.yml)
    ↓
Executa Cypress Tests
    ↓
Gera relatórios XML
    ↓
Upload automático para Qase
    ↓
Resultados aparecem no Qase.io
```

---

## 🚀 Como Configurar

### Passo 1: Obter o Token do Qase

1. Acesse [Qase.io](https://qase.io)
2. Faça login na sua conta
3. Vá para **Settings** → **API Tokens**
4. Clique em **Create new token**
5. Copie o token gerado

### Passo 2: Adicionar Secret no GitHub

1. Vá para seu repositório no GitHub
2. Clique em **Settings** (engrenagem)
3. No menu lateral, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**
5. Adicione os seguintes secrets:

#### Secret 1: QASE_API_TOKEN (Obrigatório)
- **Name:** `QASE_API_TOKEN`
- **Value:** Cole o token que você copiou do Qase
- Clique em **Add secret**

#### Secret 2: QASE_PROJECT_CODE (Opcional)
- **Name:** `QASE_PROJECT_CODE`
- **Value:** Código do seu projeto no Qase (ex: `SAUCE`)
- Se não adicionar, o padrão será `SAUCE`
- Clique em **Add secret**

### Passo 3: Fazer um Push

Agora, sempre que você fizer um push para `main` ou `develop`, o workflow será executado automaticamente:

```powershell
git add .
git commit -m "seu commit aqui"
git push origin main
```

---

## 📊 O que Acontece Automaticamente

### 1️⃣ Testes Executam
- Cypress roda todos os testes
- Gera relatórios em XML

### 2️⃣ Upload para Qase
- Script `qase-upload.js` envia resultados
- Identifica testes pelo padrão `[SAUCE-N]`
- Cria um novo Run no Qase
- Associa resultados aos casos de teste

### 3️⃣ Artefatos Salvos
- **Screenshots** (se houver falha) - 7 dias
- **Resultados XML** - 30 dias
- Disponíveis em **Actions** → **Workflow name** → **Artifacts**

### 4️⃣ Relatórios Gerados
- Visível no GitHub em **Actions** → **Test Results**
- Visível no Qase em **Runs**

---

## 🔍 Monitorar Execução

### No GitHub

1. Vá para **Actions**
2. Clique em **Cypress Tests - Automation Suite**
3. Veja a execução em tempo real
4. Clique em um run para ver detalhes

### No Qase

1. Acesse [Qase.io](https://qase.io)
2. Vá para seu projeto (SAUCE)
3. Clique em **Runs**
4. Você verá os resultados enviados pelo GitHub Actions

---

## 📅 Acionadores (Quando o Workflow Roda)

O workflow é executado em:

✅ **Push** para `main` ou `develop`
✅ **Pull Request** para `main` ou `develop`
✅ **Diariamente** às 8h UTC (scheduled)

---

## ⚙️ Variáveis de Ambiente

O workflow passa automaticamente as seguintes variáveis para o script de upload:

```yaml
QASE_API_TOKEN: Token de autenticação (do GitHub Secrets)
QASE_PROJECT_CODE: SAUCE (padrão)
QASE_API_BASE_URL: https://api.qase.io/v1
QASE_RUN_TITLE: "GitHub Actions - Node X.X"
```

---

## 🐛 Troubleshooting

### ❌ Upload falha com erro de autenticação

**Problema:** `QASE_API_TOKEN` não configurado ou inválido

**Solução:**
1. Verifique se o secret `QASE_API_TOKEN` está configurado no GitHub
2. Regenere um novo token no Qase
3. Atualize o secret no GitHub

### ❌ Nenhum resultado aparece no Qase

**Problema:** Testes não têm o padrão `[SAUCE-N]` nos títulos

**Solução:**
1. Verifique se seus testes contêm `[SAUCE-1]`, `[SAUCE-2]`, etc. nos títulos
2. O padrão é obrigatório para o Qase reconhecer os casos

### ❌ Workflow falha mas os testes passam

**Problema:** `continue-on-error: true` permite que workflow continue mesmo com falha

**Isso é intencional!** Garante que:
- Testes sempre fazem upload
- Mesmo com falhas, resultados vão para Qase
- GitHub não bloqueia PR por falha de teste

---

## 📝 Arquivo do Workflow

O arquivo está em: `.github/workflows/tests.yml`

**Principais características:**
- Testa com Node.js 18.x e 20.x
- Faz upload para Qase sempre
- Salva artefatos de falha
- Publica relatório no GitHub

---

## ✨ Próximas Melhorias (Opcional)

Você pode adicionar:

1. **Notificações via Slack/Email** quando testes falham
2. **Workflow separado** para apenas auth ou inventory
3. **Status badge** no README mostrando último status
4. **Relatórios visuais** customizados

---

## 📚 Referências

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Qase API Docs](https://docs.qase.io/api)
- [Cypress Docs](https://docs.cypress.io)

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026

