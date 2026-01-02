# Como Criar e Conectar Repositório GitHub

## ✅ Status Atual

- [x] Git inicializado
- [x] Arquivos adicionados
- [x] Commit inicial criado
- [ ] Repositório GitHub criado
- [ ] Conectado ao GitHub
- [ ] Push realizado

## Passo a Passo

### 1. Criar Repositório no GitHub

Acesse: https://github.com/new

**Configurações recomendadas:**
- **Repository name:** `lyvinx-frontend` (ou o nome que preferir)
- **Description:** `Lyvinx - Sistema de Gestão Financeira (Frontend)`
- **Visibility:** Public ou Private (sua escolha)
- **NÃO marque** nenhuma opção de "Initialize this repository with:"
  - ❌ NÃO adicione README
  - ❌ NÃO adicione .gitignore
  - ❌ NÃO adicione license

  _(Já temos esses arquivos localmente!)_

Clique em **"Create repository"**

### 2. Conectar Repositório Local ao GitHub

Após criar o repositório, você verá uma página com instruções.

**Cole os comandos abaixo no terminal** (já estão preparados):

```bash
# Navegar até a pasta do projeto
cd "C:\Users\Usuario\Downloads\Lynvix frontend\html-version"

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/lyvinx-frontend.git

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Fazer push do código
git push -u origin main
```

**⚠️ IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu username do GitHub!

### 3. Alternativa: Usar GitHub CLI

Se tiver o GitHub CLI instalado (`gh`), é mais rápido:

```bash
# Navegar até a pasta
cd "C:\Users\Usuario\Downloads\Lynvix frontend\html-version"

# Criar repositório e fazer push automaticamente
gh repo create lyvinx-frontend --public --source=. --push
```

### 4. Verificar se Funcionou

Após fazer push, acesse:
```
https://github.com/SEU-USUARIO/lyvinx-frontend
```

Você deve ver todos os seus arquivos lá!

## Comandos Úteis (Para o Futuro)

```bash
# Ver status do repositório
git status

# Ver histórico de commits
git log --oneline

# Ver repositórios remotos configurados
git remote -v

# Fazer pull das mudanças do GitHub
git pull

# Fazer push de novos commits
git push
```

## Workflow Normal de Desenvolvimento

```bash
# 1. Fazer mudanças nos arquivos
# ... edite seus arquivos ...

# 2. Ver o que mudou
git status

# 3. Adicionar arquivos modificados
git add .

# 4. Fazer commit
git commit -m "Descrição das mudanças"

# 5. Enviar para GitHub
git push
```

## Troubleshooting

### Erro: "remote origin already exists"

```bash
# Remover o remote antigo
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU-USUARIO/lyvinx-frontend.git
```

### Erro de autenticação

Se pedir usuário/senha ao fazer push:

**Opção 1: HTTPS com Token (Recomendado)**
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Marque: `repo` (acesso completo aos repositórios)
4. Copie o token
5. Use o token como senha ao fazer push

**Opção 2: SSH**
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar em: https://github.com/settings/keys

# Mudar URL do remote para SSH
git remote set-url origin git@github.com:SEU-USUARIO/lyvinx-frontend.git
```

### Branch main vs master

Se o GitHub pedir branch "main" mas você tem "master":

```bash
# Renomear branch
git branch -M main

# Fazer push
git push -u origin main
```

## Próximos Passos Após Push

1. **Deploy Automático na Vercel:**
   - Acesse: https://vercel.com/new
   - Conecte seu repositório GitHub
   - A Vercel fará deploy automaticamente a cada push!

2. **Configurar GitHub Actions (Opcional):**
   - CI/CD automático
   - Testes antes de fazer deploy
   - Validação de código

3. **Adicionar Badge no README:**
   ```markdown
   ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
   ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
   ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
   ```

## Links Úteis

- **Criar repositório:** https://github.com/new
- **Seus repositórios:** https://github.com?tab=repositories
- **GitHub Desktop (interface gráfica):** https://desktop.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
