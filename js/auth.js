// ===================================
// AUTENTICAÇÃO E GERENCIAMENTO DE ESTADO
// ===================================

const Auth = (() => {
    let user = null;
    let isAuthenticated = false;
    let listeners = [];

    /**
     * Inicializa o estado de autenticação
     */
    function init() {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        if (storedUser && token) {
            user = JSON.parse(storedUser);
            isAuthenticated = true;
        }
    }

    /**
     * Registra um listener para mudanças de autenticação
     * @param {Function} callback - Função a ser chamada quando o estado mudar
     */
    function subscribe(callback) {
        listeners.push(callback);
    }

    /**
     * Notifica todos os listeners
     */
    function notify() {
        listeners.forEach(callback => callback({ user, isAuthenticated }));
    }

    /**
     * Faz login do usuário
     * @param {object} credentials - Email e senha
     * @returns {Promise<object>} - Dados do usuário
     */
    async function login(credentials) {
        try {
            const data = await API.auth.login(credentials);

            // Salva os dados no localStorage
            const { user: userData, accessToken, refreshToken } = data;
            user = userData;
            isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            notify();

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Registra um novo usuário
     * @param {object} data - Dados do usuário
     * @returns {Promise<object>} - Dados do usuário
     */
    async function register(data) {
        try {
            const result = await API.auth.register(data);

            // Salva os dados no localStorage
            const { user: userData, accessToken, refreshToken } = result;
            user = userData;
            isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            notify();

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Faz logout do usuário
     */
    async function logout() {
        try {
            await API.auth.logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            // Limpa os dados
            user = null;
            isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            notify();
        }
    }

    /**
     * Obtém o usuário atual
     * @returns {object|null} - Usuário atual
     */
    function getUser() {
        return user;
    }

    /**
     * Verifica se está autenticado
     * @returns {boolean}
     */
    function checkAuth() {
        return isAuthenticated;
    }

    return {
        init,
        subscribe,
        login,
        register,
        logout,
        getUser,
        checkAuth
    };
})();

// ===================================
// GERENCIAMENTO DE TEMA
// ===================================

const Theme = (() => {
    let currentTheme = 'light';
    let listeners = [];

    /**
     * Inicializa o tema
     */
    function init() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            currentTheme = storedTheme;
        } else {
            // Verifica preferência do sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentTheme = prefersDark ? 'dark' : 'light';
        }

        applyTheme();
    }

    /**
     * Aplica o tema ao documento
     */
    function applyTheme() {
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', currentTheme);
        notify();
    }

    /**
     * Alterna entre temas
     */
    function toggle() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
    }

    /**
     * Define o tema
     * @param {string} theme - 'light' ou 'dark'
     */
    function setTheme(theme) {
        currentTheme = theme;
        applyTheme();
    }

    /**
     * Obtém o tema atual
     * @returns {string}
     */
    function getTheme() {
        return currentTheme;
    }

    /**
     * Registra um listener para mudanças de tema
     * @param {Function} callback
     */
    function subscribe(callback) {
        listeners.push(callback);
    }

    /**
     * Notifica todos os listeners
     */
    function notify() {
        listeners.forEach(callback => callback(currentTheme));
    }

    return {
        init,
        toggle,
        setTheme,
        getTheme,
        subscribe
    };
})();

// Inicializa o tema ao carregar
Theme.init();
