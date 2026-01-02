// ===================================
// ROUTER - Sistema de roteamento SPA
// ===================================

const Router = (() => {
    let routes = {};
    let currentRoute = null;

    /**
     * Registra uma rota
     * @param {string} path - Caminho da rota
     * @param {object} config - Configuração da rota
     */
    function addRoute(path, config) {
        routes[path] = config;
    }

    /**
     * Navega para uma rota
     * @param {string} path - Caminho da rota
     */
    function navigate(path) {
        window.history.pushState({}, '', path);
        loadRoute();
    }

    /**
     * Carrega a rota atual
     */
    function loadRoute() {
        const path = window.location.pathname;
        currentRoute = path;

        const route = routes[path] || routes['/404'] || routes['/'];

        if (!route) {
            console.error('Rota não encontrada:', path);
            return;
        }

        // Verifica autenticação
        if (route.requiresAuth && !Auth.checkAuth()) {
            navigate('/login');
            return;
        }

        if (route.guestOnly && Auth.checkAuth()) {
            navigate('/dashboard');
            return;
        }

        // Renderiza a página
        render(route);
    }

    /**
     * Renderiza uma rota
     * @param {object} route - Configuração da rota
     */
    function render(route) {
        const app = document.getElementById('app');
        app.innerHTML = '';

        if (route.layout) {
            // Renderiza com layout
            const layout = Layout.render();
            const content = route.component.render();
            const mainContent = layout.querySelector('.main-content');
            mainContent.appendChild(content);
            app.appendChild(layout);
        } else {
            // Renderiza sem layout
            const content = route.component.render();
            app.appendChild(content);
        }
    }

    /**
     * Inicializa o router
     */
    function init() {
        // Rotas públicas
        addRoute('/login', {
            component: LoginPage,
            guestOnly: true
        });

        addRoute('/register', {
            component: RegisterPage,
            guestOnly: true
        });

        // Rotas privadas
        addRoute('/dashboard', {
            component: DashboardPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/', {
            component: DashboardPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/transactions', {
            component: TransactionsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/cards', {
            component: CardsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/accounts', {
            component: AccountsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/categories', {
            component: CategoriesPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/goals', {
            component: GoalsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/budgets', {
            component: BudgetsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/reports', {
            component: ReportsPage,
            requiresAuth: true,
            layout: true
        });

        addRoute('/profile', {
            component: ProfilePage,
            requiresAuth: true,
            layout: true
        });

        // Event listeners
        window.addEventListener('popstate', loadRoute);

        // Intercepta cliques em links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
                navigate(link.getAttribute('href'));
            }
        });

        // Carrega rota inicial
        loadRoute();
    }

    return {
        init,
        navigate,
        addRoute
    };
})();

// ===================================
// LAYOUT - Header e Sidebar
// ===================================

const Layout = (() => {
    function render() {
        const layout = document.createElement('div');
        layout.className = 'main-layout';

        // Sidebar
        const sidebar = renderSidebar();
        layout.appendChild(sidebar);

        // Main content wrapper
        const mainWrapper = document.createElement('div');
        mainWrapper.className = 'main-content-wrapper';

        // Header
        const header = renderHeader();
        mainWrapper.appendChild(header);

        // Main content
        const mainContent = document.createElement('main');
        mainContent.className = 'main-content';
        mainWrapper.appendChild(mainContent);

        layout.appendChild(mainWrapper);

        // Sidebar overlay (mobile)
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebar-overlay';
        overlay.addEventListener('click', closeSidebar);
        layout.appendChild(overlay);

        return layout;
    }

    function renderHeader() {
        const header = document.createElement('header');
        header.className = 'header';

        const user = Auth.getUser();

        header.innerHTML = `
            <div class="header-left">
                <button class="hamburger-btn" id="hamburger-btn">
                    <i data-lucide="menu"></i>
                </button>
            </div>

            <div class="header-right">
                <button class="btn btn-ghost btn-sm" id="theme-toggle">
                    <i data-lucide="${Theme.getTheme() === 'dark' ? 'sun' : 'moon'}"></i>
                </button>

                <button class="btn btn-ghost btn-sm">
                    <i data-lucide="bell"></i>
                </button>

                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 2rem; height: 2rem; border-radius: 50%; background: var(--primary-600); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">
                        ${Utils.getInitials(user?.name || 'User')}
                    </div>
                    <button class="btn btn-ghost btn-sm" id="user-menu-btn">
                        <i data-lucide="chevron-down"></i>
                    </button>
                </div>
            </div>
        `;

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const hamburgerBtn = header.querySelector('#hamburger-btn');
            hamburgerBtn.addEventListener('click', toggleSidebar);

            const themeToggle = header.querySelector('#theme-toggle');
            themeToggle.addEventListener('click', () => {
                Theme.toggle();
                const icon = themeToggle.querySelector('i');
                icon.setAttribute('data-lucide', Theme.getTheme() === 'dark' ? 'sun' : 'moon');
                lucide.createIcons();
            });

            const userMenuBtn = header.querySelector('#user-menu-btn');
            userMenuBtn.addEventListener('click', showUserMenu);
        }, 0);

        return header;
    }

    function renderSidebar() {
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.id = 'sidebar';

        const menuItems = [
            { icon: 'layout-dashboard', label: 'Dashboard', path: '/dashboard' },
            { icon: 'arrow-left-right', label: 'Transações', path: '/transactions' },
            { icon: 'credit-card', label: 'Cartões', path: '/cards' },
            { icon: 'wallet', label: 'Contas', path: '/accounts' },
            { icon: 'tag', label: 'Categorias', path: '/categories' },
            { icon: 'target', label: 'Metas', path: '/goals' },
            { icon: 'pie-chart', label: 'Orçamentos', path: '/budgets' },
            { icon: 'bar-chart-2', label: 'Relatórios', path: '/reports' }
        ];

        let menuHTML = `
            <div class="sidebar-logo">
                <i data-lucide="zap" class="sidebar-logo-icon"></i>
                <span class="sidebar-logo-text">Lyvinx</span>
            </div>

            <nav>
                <ul class="sidebar-nav">
        `;

        menuItems.forEach(item => {
            const isActive = window.location.pathname === item.path;
            menuHTML += `
                <li class="sidebar-nav-item">
                    <a href="${item.path}" class="sidebar-nav-link ${isActive ? 'active' : ''}" data-link>
                        <i data-lucide="${item.icon}" class="sidebar-nav-icon"></i>
                        <span>${item.label}</span>
                    </a>
                </li>
            `;
        });

        menuHTML += `
                </ul>
            </nav>
        `;

        sidebar.innerHTML = menuHTML;

        // Inicializa ícones
        setTimeout(() => lucide.createIcons(), 0);

        return sidebar;
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }

    function showUserMenu() {
        const user = Auth.getUser();

        const modal = UI.Modal({
            title: 'Menu do Usuário',
            size: 'sm'
        });

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '1rem';

        content.innerHTML = `
            <div style="text-align: center; padding: 1rem 0;">
                <div style="width: 4rem; height: 4rem; border-radius: 50%; background: var(--primary-600); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.5rem; margin: 0 auto 1rem;">
                    ${Utils.getInitials(user?.name || 'User')}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${user?.name || 'Usuário'}</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">${user?.email || ''}</p>
            </div>
        `;

        const profileBtn = UI.Button({
            text: 'Meu Perfil',
            variant: 'outline',
            icon: 'user',
            fullWidth: true,
            onClick: () => {
                modal.close();
                Router.navigate('/profile');
            }
        });

        const logoutBtn = UI.Button({
            text: 'Sair',
            variant: 'danger',
            icon: 'log-out',
            fullWidth: true,
            onClick: async () => {
                modal.close();
                await Auth.logout();
                Router.navigate('/login');
            }
        });

        content.appendChild(profileBtn);
        content.appendChild(logoutBtn);

        modal.setContent(content);
        modal.open();
    }

    return {
        render
    };
})();

// ===================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa autenticação
    Auth.init();

    // Inicializa router
    Router.init();

    // Remove loading inicial
    const loading = document.getElementById('initial-loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
    }
});
