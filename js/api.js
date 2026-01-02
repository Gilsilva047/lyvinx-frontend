// ===================================
// API CLIENT
// ===================================

const API = (() => {
    const BASE_URL = CONFIG.API_URL;

    /**
     * Faz uma requisição HTTP
     * @param {string} endpoint - Endpoint da API
     * @param {object} options - Opções da requisição
     * @returns {Promise<any>} - Resposta da API
     */
    async function request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                ...options.headers
            }
        };

        // Adiciona token de autenticação se existir
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Adiciona body se existir
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);

            // Se não autenticado, redireciona para login
            if (response.status === 401) {
                // Tenta refresh token
                const refreshed = await refreshToken();
                if (refreshed) {
                    // Tenta novamente a requisição original
                    return request(endpoint, options);
                } else {
                    // Se falhar, desloga o usuário
                    Auth.logout();
                    Router.navigate('/login');
                    throw new Error('Não autenticado');
                }
            }

            // Parse da resposta
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na requisição');
            }

            // Backend retorna { success, data }, então retornamos apenas o data
            return result.data || result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Atualiza o token de acesso
     * @returns {Promise<boolean>} - Se conseguiu atualizar
     */
    async function refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return false;

            const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) return false;

            const result = await response.json();

            // Backend retorna os dados dentro de "data"
            const data = result.data || result;
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            return true;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    }

    // ===================================
    // SERVIÇOS DE AUTENTICAÇÃO
    // ===================================

    const authService = {
        async login(credentials) {
            return request('/auth/login', {
                method: 'POST',
                body: credentials
            });
        },

        async register(data) {
            return request('/auth/register', {
                method: 'POST',
                body: data
            });
        },

        async logout() {
            return request('/auth/logout', {
                method: 'POST'
            });
        }
    };

    // ===================================
    // SERVIÇOS DE USUÁRIO
    // ===================================

    const userService = {
        async getMe() {
            return request('/users/me');
        },

        async updateMe(data) {
            return request('/users/me', {
                method: 'PUT',
                body: data
            });
        },

        async updatePassword(data) {
            return request('/users/me/password', {
                method: 'PUT',
                body: data
            });
        },

        async deleteMe() {
            return request('/users/me', {
                method: 'DELETE'
            });
        }
    };

    // ===================================
    // SERVIÇOS DE TRANSAÇÕES
    // ===================================

    const transactionService = {
        async getAll(params) {
            const queryString = new URLSearchParams(params).toString();
            return request(`/transactions${queryString ? '?' + queryString : ''}`);
        },

        async getById(id) {
            return request(`/transactions/${id}`);
        },

        async create(data) {
            return request('/transactions', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/transactions/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async updateStatus(id, status) {
            return request(`/transactions/${id}/status`, {
                method: 'PATCH',
                body: { status }
            });
        },

        async delete(id) {
            return request(`/transactions/${id}`, {
                method: 'DELETE'
            });
        }
    };

    // ===================================
    // SERVIÇOS DE CONTAS
    // ===================================

    const accountService = {
        async getAll() {
            return request('/accounts');
        },

        async getById(id) {
            return request(`/accounts/${id}`);
        },

        async create(data) {
            return request('/accounts', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/accounts/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async delete(id) {
            return request(`/accounts/${id}`, {
                method: 'DELETE'
            });
        },

        async transfer(data) {
            return request('/accounts/transfer', {
                method: 'POST',
                body: data
            });
        }
    };

    // ===================================
    // SERVIÇOS DE CARTÕES
    // ===================================

    const cardService = {
        async getAll() {
            return request('/cards');
        },

        async getById(id) {
            return request(`/cards/${id}`);
        },

        async create(data) {
            return request('/cards', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/cards/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async delete(id) {
            return request(`/cards/${id}`, {
                method: 'DELETE'
            });
        },

        async getInvoice(id, month, year) {
            return request(`/cards/${id}/invoice?month=${month}&year=${year}`);
        }
    };

    // ===================================
    // SERVIÇOS DE CATEGORIAS
    // ===================================

    const categoryService = {
        async getAll() {
            return request('/categories');
        },

        async getById(id) {
            return request(`/categories/${id}`);
        },

        async create(data) {
            return request('/categories', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/categories/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async delete(id) {
            return request(`/categories/${id}`, {
                method: 'DELETE'
            });
        }
    };

    // ===================================
    // SERVIÇOS DE METAS
    // ===================================

    const goalService = {
        async getAll() {
            return request('/goals');
        },

        async getById(id) {
            return request(`/goals/${id}`);
        },

        async create(data) {
            return request('/goals', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/goals/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async delete(id) {
            return request(`/goals/${id}`, {
                method: 'DELETE'
            });
        },

        async contribute(id, amount) {
            return request(`/goals/${id}/contribute`, {
                method: 'POST',
                body: { amount }
            });
        }
    };

    // ===================================
    // SERVIÇOS DE ORÇAMENTOS
    // ===================================

    const budgetService = {
        async getAll() {
            return request('/budgets');
        },

        async getById(id) {
            return request(`/budgets/${id}`);
        },

        async create(data) {
            return request('/budgets', {
                method: 'POST',
                body: data
            });
        },

        async update(id, data) {
            return request(`/budgets/${id}`, {
                method: 'PUT',
                body: data
            });
        },

        async delete(id) {
            return request(`/budgets/${id}`, {
                method: 'DELETE'
            });
        },

        async getStatus(id) {
            return request(`/budgets/${id}/status`);
        }
    };

    // ===================================
    // SERVIÇOS DE RELATÓRIOS
    // ===================================

    const reportService = {
        async getSummary(startDate, endDate) {
            return request(`/reports/summary?startDate=${startDate}&endDate=${endDate}`);
        },

        async getEvolution(startDate, endDate) {
            return request(`/reports/evolution?startDate=${startDate}&endDate=${endDate}`);
        },

        async getByCategory(startDate, endDate) {
            return request(`/reports/by-category?startDate=${startDate}&endDate=${endDate}`);
        },

        async getByPaymentMethod(startDate, endDate) {
            return request(`/reports/by-payment-method?startDate=${startDate}&endDate=${endDate}`);
        }
    };

    return {
        auth: authService,
        user: userService,
        transaction: transactionService,
        account: accountService,
        card: cardService,
        category: categoryService,
        goal: goalService,
        budget: budgetService,
        report: reportService
    };
})();
