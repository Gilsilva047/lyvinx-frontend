# Guia Rápido de Deploy - Lyvinx Frontend

## Pré-requisitos

Antes de fazer deploy, verifique:

- [ ] Backend já está em produção
- [ ] URL do backend de produção está configurada em `js/config.js`
- [ ] CORS configurado no backend para aceitar o domínio do frontend
- [ ] Aplicação testada localmente

## Passo a Passo - Deploy na Vercel (Recomendado)

### 1. Atualizar configuração

Edite o arquivo `js/config.js` e confirme a URL de produção:

```javascript
const API_URLS = {
    development: 'http://localhost:3333/api/v1',
    production: 'https://lynvix-backend.vercel.app/api/v1'  // Confirme esta URL
};
```

### 2. Instalar Vercel CLI (primeira vez)

```bash
npm i -g vercel
```

### 3. Fazer login na Vercel

```bash
vercel login
```

### 4. Deploy

```bash
cd html-version
vercel
```

Siga as instruções:
- Set up and deploy? **Y**
- Which scope? Selecione sua conta
- Link to existing project? **N** (primeira vez) ou **Y** (deploys subsequentes)
- What's your project's name? **lyvinx-frontend** (ou o nome que preferir)
- In which directory is your code located? **./** (pressione Enter)

### 5. Deploy para produção

```bash
vercel --prod
```

### 6. Verificar

Acesse a URL fornecida pela Vercel (ex: https://lyvinx-frontend.vercel.app)

## Configurar CORS no Backend

Após obter a URL do frontend, configure o CORS no backend:

```javascript
// No seu backend (Express.js)
app.use(cors({
  origin: [
    'http://localhost:8000',
    'https://lyvinx-frontend.vercel.app',  // Adicione sua URL aqui
  ],
  credentials: true
}));
```

Faça redeploy do backend após esta mudança.

## Verificação Pós-Deploy

1. Abra a URL do frontend em produção
2. Abra o DevTools (F12) > Console
3. Verifique se aparece:
   ```
   Environment: production
   API URL: https://lynvix-backend.vercel.app/api/v1
   ```
4. Teste:
   - [ ] Criar conta
   - [ ] Fazer login
   - [ ] Criar uma transação
   - [ ] Visualizar dashboard
   - [ ] Editar perfil

## Deploys Futuros

Para fazer deploy de novas versões:

```bash
cd html-version
vercel --prod
```

## Alternativa: Deploy na Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd html-version
netlify deploy --prod
```

## Domínio Customizado (Opcional)

### Na Vercel:

1. Acesse o projeto no dashboard da Vercel
2. Settings > Domains
3. Adicione seu domínio customizado
4. Configure os registros DNS conforme instruções

### Atualizar CORS:

Adicione o novo domínio no backend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8000',
    'https://lyvinx-frontend.vercel.app',
    'https://seu-dominio.com',  // Seu domínio customizado
  ],
  credentials: true
}));
```

## Troubleshooting

### Erro de CORS

**Sintoma:** Console mostra erro de CORS ao fazer requisições

**Solução:**
1. Verifique se o backend está configurado para aceitar a origem do frontend
2. Verifique se não há typos na URL do backend em `js/config.js`

### Página em branco após deploy

**Sintoma:** Página carrega em branco

**Solução:**
1. Verifique o console do navegador para erros
2. Confirme que todos os arquivos foram incluídos no deploy
3. Verifique se o `vercel.json` está na pasta raiz

### API não responde

**Sintoma:** Requisições retornam erro 404 ou timeout

**Solução:**
1. Verifique se o backend está rodando
2. Teste a URL do backend diretamente no navegador
3. Confirme que a URL em `js/config.js` está correta

### Cache antigo após deploy

**Sintoma:** Mudanças não aparecem após deploy

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Abra em modo anônimo/privado
3. Faça hard refresh (Ctrl+Shift+R)

## URLs Importantes

- **Frontend (Vercel):** https://lyvinx-frontend.vercel.app (substitua pela sua)
- **Backend (Vercel):** https://lynvix-backend.vercel.app (substitua pela sua)
- **Documentação da Vercel:** https://vercel.com/docs
- **Documentação da Netlify:** https://docs.netlify.com

## Comandos Úteis

```bash
# Ver status do projeto na Vercel
vercel ls

# Ver logs
vercel logs

# Remover projeto
vercel remove

# Ver domínios configurados
vercel domains ls
```

## Checklist de Deploy

- [ ] Backend em produção e funcionando
- [ ] URL do backend atualizada em `js/config.js`
- [ ] CORS configurado no backend
- [ ] Vercel CLI instalada
- [ ] Deploy feito com sucesso
- [ ] URL de produção acessível
- [ ] Console sem erros
- [ ] Login funcionando
- [ ] Criação de transações funcionando
- [ ] CORS do backend atualizado com URL do frontend
- [ ] Testes básicos realizados

## Suporte

Se encontrar problemas:
1. Verifique a seção Troubleshooting acima
2. Consulte os logs da Vercel: `vercel logs`
3. Verifique o console do navegador
4. Teste a API diretamente com ferramentas como Postman ou Thunder Client
