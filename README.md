# Lyvinx - Versão HTML/CSS/JavaScript

Versão convertida do projeto React Lyvinx para HTML, CSS e JavaScript vanilla.

## Estrutura do Projeto

```
html-version/
├── index.html              # Arquivo principal da SPA
├── css/
│   ├── styles.css         # Estilos globais e variáveis de tema
│   └── components.css     # Estilos dos componentes UI
├── js/
│   ├── utils.js           # Funções utilitárias
│   ├── api.js             # Cliente API e serviços
│   ├── auth.js            # Autenticação e gerenciamento de tema
│   ├── components.js      # Componentes UI reutilizáveis
│   ├── app.js             # Aplicação principal, roteamento e layout
│   └── pages/
│       ├── login.js       # Página de login
│       ├── register.js    # Página de registro
│       ├── dashboard.js   # Página de dashboard
│       ├── transactions.js # Página de transações
│       ├── cards.js       # Página de cartões
│       ├── accounts.js    # Página de contas
│       ├── categories.js  # Página de categorias
│       ├── goals.js       # Página de metas
│       ├── budgets.js     # Página de orçamentos
│       ├── reports.js     # Página de relatórios
│       └── profile.js     # Página de perfil
└── README.md              # Este arquivo
```

## Funcionalidades Implementadas

### Autenticação
- ✅ Login com email e senha
- ✅ Registro de novos usuários com validação de CPF
- ✅ Validação de formulários
- ✅ Persistência de sessão em localStorage
- ✅ Refresh token automático
- ✅ Logout

### Interface do Usuário
- ✅ SPA (Single Page Application) com roteamento em JavaScript vanilla
- ✅ Layout responsivo com sidebar colapsável em mobile
- ✅ Tema claro/escuro com persistência
- ✅ Componentes UI reutilizáveis (Button, Input, Card, Modal, Badge, Toast, Loading, ProgressBar)
- ✅ Header com toggle de tema e menu de usuário
- ✅ Sidebar com navegação completa

### Dashboard
- ✅ Cards de resumo financeiro (receitas, despesas, saldo, taxa de economia)
- ✅ Integração com API para buscar dados reais
- ✅ Atualização automática dos valores

### Transações
- ✅ Listagem de transações com filtros (tipo, status, período)
- ✅ Criação de novas transações
- ✅ Edição e exclusão de transações
- ✅ Badges de status e tipo
- ✅ Formatação de valores e datas

### Cartões de Crédito
- ✅ Visualização de cartões com design moderno
- ✅ Criação de novos cartões
- ✅ Exclusão de cartões
- ✅ Barra de progresso de limite disponível
- ✅ Informações de vencimento e fechamento

### Contas Bancárias
- ✅ Listagem de contas por tipo (corrente, poupança, investimento)
- ✅ Criação de novas contas
- ✅ Exclusão de contas
- ✅ Transferências entre contas
- ✅ Visualização de saldos

### Categorias
- ✅ Grid de categorias com ícones personalizados
- ✅ Criação de categorias com cor e ícone
- ✅ Exclusão de categorias (exceto padrão)
- ✅ Identificação de categorias padrão

### Metas
- ✅ Visualização de metas com barra de progresso
- ✅ Criação de metas com prazo
- ✅ Contribuição para metas
- ✅ Indicador de metas atingidas
- ✅ Cálculo de percentual de progresso

### Orçamentos
- ✅ Listagem de orçamentos por categoria
- ✅ Criação de orçamentos mensais
- ✅ Exclusão de orçamentos
- ✅ Alertas visuais (70%, 90%, 100%)
- ✅ Barra de progresso com cores

### Relatórios
- ✅ Resumo financeiro do período
- ✅ Relatório por categoria
- ✅ Relatório por método de pagamento
- ✅ Filtro de período personalizado
- ✅ Gráficos em barras de progresso

### Perfil
- ✅ Visualização de dados do usuário
- ✅ Edição de informações pessoais
- ✅ Alteração de senha
- ✅ Exclusão de conta
- ✅ Validação de CPF com máscara

### Componentes UI
- **Button**: Variantes (primary, secondary, outline, ghost, danger) e tamanhos (sm, md, lg)
- **Input**: Suporte a label, ícones, validação, helper text e mensagens de erro
- **Card**: Variantes (elevated, outlined, filled) com header e footer opcionais
- **Badge**: Badges coloridos (success, danger, warning, info, primary, secondary)
- **Modal**: Modal com overlay, fechamento por ESC ou clique fora
- **Toast**: Notificações toast com diferentes tipos
- **Loading**: Spinner de carregamento

### API
- ✅ Cliente HTTP com fetch
- ✅ Interceptadores para autenticação
- ✅ Serviços para todos os endpoints:
  - Autenticação (login, register, logout)
  - Usuários (getMe, updateMe, updatePassword, deleteMe)
  - Transações (CRUD completo)
  - Contas (CRUD + transferências)
  - Cartões (CRUD + faturas)
  - Categorias (CRUD)
  - Metas (CRUD + contribuições)
  - Orçamentos (CRUD + status)
  - Relatórios (summary, evolution, by-category, by-payment-method)

## Como Usar

### 1. Configuração de Ambiente

A aplicação detecta automaticamente o ambiente baseado no hostname:
- **Desenvolvimento**: Quando rodando em `localhost` ou `127.0.0.1`
- **Produção**: Quando rodando em qualquer outro domínio

As URLs da API são configuradas em `js/config.js`:
- **Desenvolvimento**: `http://localhost:3333/api/v1`
- **Produção**: `https://lynvix-backend.vercel.app/api/v1`

Para alterar a URL de produção, edite o arquivo `js/config.js`:

```javascript
const API_URLS = {
    development: 'http://localhost:3333/api/v1',
    production: 'https://SEU-BACKEND.vercel.app/api/v1'  // Altere aqui
};
```

### 2. Servir a Aplicação

A aplicação precisa ser servida por um servidor HTTP (não pode ser aberta diretamente pelo navegador devido ao CORS e módulos).

#### Opção 1: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

#### Opção 2: Python
```bash
# Python 3
cd html-version
python -m http.server 8000
```

Depois acesse `http://localhost:8000`

#### Opção 3: Node.js (http-server)
```bash
# Instalar globalmente
npm install -g http-server

# Executar
cd html-version
http-server -p 8000
```

Depois acesse `http://localhost:8000`

### 3. Acessar a Aplicação

1. Abra `http://localhost:8000` (ou a porta que você configurou)
2. Você será redirecionado para a página de login
3. Crie uma conta ou faça login com credenciais existentes

## Deploy para Produção

### 1. Preparação

Antes de fazer deploy, certifique-se de:
1. Atualizar a URL de produção do backend em `js/config.js`
2. Verificar se o CORS está configurado no backend para aceitar requisições do domínio do frontend
3. Testar localmente se tudo está funcionando

### 2. Opções de Deploy

#### Vercel (Recomendado)

```bash
# Instalar a Vercel CLI
npm i -g vercel

# Na pasta html-version, executar
cd html-version
vercel

# Seguir as instruções para fazer deploy
# A URL será algo como: https://seu-projeto.vercel.app
```

**Configuração da Vercel:**
- A detecção de ambiente é automática (não precisa configurar variáveis de ambiente)
- O `js/config.js` detectará automaticamente que não está em localhost e usará a URL de produção

#### Netlify

```bash
# Opção 1: Netlify Drop
# Acesse https://app.netlify.com/drop
# Arraste a pasta html-version para o site

# Opção 2: Netlify CLI
npm i -g netlify-cli
cd html-version
netlify deploy --prod
```

#### GitHub Pages

```bash
# 1. Crie um branch gh-pages
git checkout -b gh-pages

# 2. Copie os arquivos da pasta html-version para a raiz
cp -r html-version/* .

# 3. Commit e push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. Configure nas Settings do repositório:
# Settings > Pages > Source: gh-pages branch
```

#### Servidor Próprio (Apache/Nginx)

**Apache (.htaccess na raiz):**
```apache
# Habilitar rewrite
RewriteEngine On

# Redirecionar tudo para index.html (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/lyvinx;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Pós-Deploy

Após fazer o deploy:

1. **Teste a aplicação** no domínio de produção
2. **Verifique o console do navegador** para erros
3. **Teste todas as funcionalidades principais**:
   - Login/Registro
   - Criação de transações
   - Visualização de dados
   - Atualização de perfil

### 4. Configuração de CORS no Backend

Certifique-se de que o backend permite requisições do seu domínio de produção.

No backend (Express.js), algo como:

```javascript
// backend/src/server.js
app.use(cors({
  origin: [
    'http://localhost:8000',
    'https://seu-frontend.vercel.app',  // Adicione seu domínio aqui
    'https://seu-dominio.com'
  ],
  credentials: true
}));
```

### 5. Verificação de Produção

Para verificar se está usando a URL correta:

1. Abra o DevTools (F12)
2. Vá na aba Console
3. Você verá o log: `Environment: production` e `API URL: https://lynvix-backend.vercel.app/api/v1`
4. Se estiver em desenvolvimento, verá: `Environment: development`

## Principais Diferenças do React

### React → Vanilla JS

| React | Vanilla JS |
|-------|-----------|
| `useState`, `useEffect` | Variáveis globais, event listeners |
| `useContext` | Módulos singleton com padrão observer |
| `React Router` | Router customizado com History API |
| JSX | `createElement` + `innerHTML` |
| Virtual DOM | Manipulação direta do DOM |
| Components | Funções que retornam HTMLElement |
| Props | Objetos de configuração |
| CSS Modules / Styled Components | CSS puro com classes |
| Tailwind CSS | CSS customizado com variáveis CSS |

## Características da Implementação

### Gerenciamento de Estado
- **Auth**: Módulo singleton que gerencia autenticação e usuário
- **Theme**: Módulo singleton que gerencia o tema (claro/escuro)
- **Padrão Observer**: Listeners para mudanças de estado

### Roteamento
- Sistema de roteamento SPA customizado
- Proteção de rotas (autenticadas vs públicas)
- History API para navegação
- Interceptação de cliques em links

### Componentes UI
- Funções factory que retornam elementos DOM
- API similar ao React (props como objeto)
- Reutilizáveis e composáveis

### Estilização
- CSS puro com variáveis CSS (custom properties)
- Sistema de design tokens
- Suporte a tema claro/escuro
- Totalmente responsivo

## Browser Support

- Chrome/Edge: Últimas 2 versões
- Firefox: Últimas 2 versões
- Safari: Últimas 2 versões

Requer suporte a:
- ES6+ (arrow functions, template literals, modules)
- Fetch API
- localStorage
- CSS Variables
- History API

## Próximos Passos

Para adicionar novas páginas:

1. Crie um arquivo em `js/pages/sua-pagina.js`
2. Exporte uma função `render()` que retorna um elemento DOM
3. Adicione a rota em `js/app.js`:

```javascript
Router.addRoute('/sua-pagina', {
    component: SuaPagina,
    requiresAuth: true,
    layout: true
});
```

4. Adicione o script no `index.html`:

```html
<script src="js/pages/sua-pagina.js"></script>
```

## Limitações Conhecidas

- Não há validação de esquemas (Zod foi usado no React, aqui é manual)
- Gráficos não implementados (seria necessário uma biblioteca como Chart.js)
- Algumas páginas estão em placeholder (Transações, Cartões, etc)
- Sem testes automatizados
- Performance pode ser inferior ao React em listas muito grandes

## Licença

MIT
