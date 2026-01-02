// ===================================
// PÁGINA DE DASHBOARD
// ===================================

const DashboardPage = (() => {
    function render() {
        const container = document.createElement('div');
        container.className = 'dashboard-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div>
                <h1 class="dashboard-title">Dashboard</h1>
                <p class="dashboard-subtitle">Visão geral das suas finanças</p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Ano</label>
                    <select id="dashboard-year-filter" class="form-select" style="min-width: 100px;">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026" selected>2026</option>
                        <option value="2027">2027</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Mês</label>
                    <select id="dashboard-month-filter" class="form-select" style="min-width: 150px;">
                        <option value="">Todos os meses</option>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>
            </div>
        `;
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'flex-start';
        container.appendChild(header);

        // Stats Grid
        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid';
        statsGrid.id = 'stats-grid';

        // Cards de estatísticas (placeholders)
        const stats = [
            {
                title: 'Receitas',
                value: 'R$ 0,00',
                icon: 'trending-up',
                iconClass: 'stat-icon-success',
                change: '+0%',
                changeClass: 'stat-change-positive'
            },
            {
                title: 'Despesas',
                value: 'R$ 0,00',
                icon: 'trending-down',
                iconClass: 'stat-icon-danger',
                change: '-0%',
                changeClass: 'stat-change-negative'
            },
            {
                title: 'Saldo',
                value: 'R$ 0,00',
                icon: 'wallet',
                iconClass: 'stat-icon-primary',
                change: '+0%',
                changeClass: 'stat-change-positive'
            },
            {
                title: 'Taxa de Economia',
                value: '0%',
                icon: 'piggy-bank',
                iconClass: 'stat-icon-info',
                change: '+0%',
                changeClass: 'stat-change-positive'
            }
        ];

        stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <div class="stat-header">
                    <span class="stat-title">${stat.title}</span>
                    <div class="stat-icon ${stat.iconClass}">
                        <i data-lucide="${stat.icon}"></i>
                    </div>
                </div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-change ${stat.changeClass}">
                    <i data-lucide="${stat.changeClass === 'stat-change-positive' ? 'arrow-up' : 'arrow-down'}"></i>
                    <span>${stat.change} vs. mês anterior</span>
                </div>
            `;
            statsGrid.appendChild(card);
        });

        container.appendChild(statsGrid);

        // Grid de gráficos
        const chartsGrid = document.createElement('div');
        chartsGrid.className = 'grid grid-cols-2';

        // Card de transações recentes
        const transactionsCard = document.createElement('div');
        transactionsCard.className = 'card card-elevated card-padding-none';
        transactionsCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Últimas Transações</h3>
            </div>
            <div class="card-body" id="transactions-body">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-lucide="inbox"></i>
                    </div>
                    <h3 class="empty-state-title">Nenhuma transação</h3>
                    <p class="empty-state-message">Você ainda não possui transações registradas.</p>
                </div>
            </div>
        `;

        // Card de gastos por categoria
        const categoriesCard = document.createElement('div');
        categoriesCard.className = 'card card-elevated card-padding-none';
        categoriesCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Gastos por Categoria</h3>
            </div>
            <div class="card-body" id="categories-body">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i data-lucide="pie-chart"></i>
                    </div>
                    <h3 class="empty-state-title">Sem dados</h3>
                    <p class="empty-state-message">Adicione transações para ver seus gastos por categoria.</p>
                </div>
            </div>
        `;

        chartsGrid.appendChild(transactionsCard);
        chartsGrid.appendChild(categoriesCard);
        container.appendChild(chartsGrid);

        // Inicializa ícones
        setTimeout(() => {
            lucide.createIcons();

            // Event listeners para os filtros
            const yearFilter = document.getElementById('dashboard-year-filter');
            const monthFilter = document.getElementById('dashboard-month-filter');

            if (yearFilter && monthFilter) {
                yearFilter.addEventListener('change', () => {
                    loadDashboardData(statsGrid, transactionsCard, categoriesCard);
                });

                monthFilter.addEventListener('change', () => {
                    loadDashboardData(statsGrid, transactionsCard, categoriesCard);
                });

                // Carrega dados iniciais
                loadDashboardData(statsGrid, transactionsCard, categoriesCard);
            } else {
                console.error('Erro: Filtros não encontrados no DOM!');
            }
        }, 0);

        return container;
    }

    async function loadDashboardData(statsGrid, transactionsCard, categoriesCard) {
        try {
            // Pega valores dos filtros
            const yearFilter = document.getElementById('dashboard-year-filter');
            const monthFilter = document.getElementById('dashboard-month-filter');

            const year = parseInt(yearFilter.value);
            const month = monthFilter.value ? parseInt(monthFilter.value) : null;

            // Calcula datas baseado nos filtros
            let startDate, endDate;

            if (month) {
                // Mês específico - corrigido para evitar problemas de fuso horário
                const paddedMonth = String(month).padStart(2, '0');
                startDate = `${year}-${paddedMonth}-01`;

                // Calcula último dia do mês
                const lastDay = new Date(year, month, 0).getDate();
                endDate = `${year}-${paddedMonth}-${String(lastDay).padStart(2, '0')}`;
            } else {
                // Ano todo
                startDate = `${year}-01-01`;
                endDate = `${year}-12-31`;
            }

            // Busca resumo
            const summary = await API.report.getSummary(startDate, endDate);

            // Atualiza cards
            const statCards = statsGrid.querySelectorAll('.stat-card');

            if (statCards[0]) {
                statCards[0].querySelector('.stat-value').textContent = Utils.formatCurrency(summary.totalIncome || 0);
            }

            if (statCards[1]) {
                statCards[1].querySelector('.stat-value').textContent = Utils.formatCurrency(summary.totalExpense || 0);
            }

            if (statCards[2]) {
                statCards[2].querySelector('.stat-value').textContent = Utils.formatCurrency(summary.balance || 0);
            }

            if (statCards[3]) {
                const rate = summary.savingsRate || 0;
                statCards[3].querySelector('.stat-value').textContent = `${rate.toFixed(1)}%`;
            }

            // Carrega transações recentes
            loadRecentTransactions(transactionsCard);

            // Carrega gastos por categoria
            await loadCategoryExpenses(categoriesCard, startDate, endDate);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            // Mantém valores padrão em caso de erro
        }
    }

    async function loadRecentTransactions(transactionsCard) {
        try {
            const transactionsBody = transactionsCard.querySelector('#transactions-body');

            // Busca as últimas 5 transações
            const transactions = await API.transaction.getAll({ limit: 5, orderBy: 'date', order: 'desc' });

            if (!transactions || transactions.length === 0) {
                // Mantém o estado vazio
                return;
            }

            // Limpa o conteúdo e cria a lista de transações
            transactionsBody.innerHTML = '';

            const list = document.createElement('div');
            list.className = 'transaction-list';

            transactions.forEach(transaction => {
                const item = document.createElement('div');
                item.className = 'transaction-item';

                const isExpense = transaction.type === 'EXPENSE';
                const icon = isExpense ? 'arrow-down-circle' : 'arrow-up-circle';
                const iconClass = isExpense ? 'transaction-icon-expense' : 'transaction-icon-income';
                const amountClass = isExpense ? 'transaction-amount-expense' : 'transaction-amount-income';
                const sign = isExpense ? '-' : '+';

                item.innerHTML = `
                    <div class="transaction-icon ${iconClass}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="transaction-description">${transaction.description || 'Sem descrição'}</div>
                        <div class="transaction-date">${Utils.formatDate(transaction.date)}</div>
                    </div>
                    <div class="transaction-amount ${amountClass}">
                        ${sign} ${Utils.formatCurrency(Math.abs(transaction.amount))}
                    </div>
                `;

                list.appendChild(item);
            });

            transactionsBody.appendChild(list);

            // Reinicializa os ícones
            setTimeout(() => lucide.createIcons(), 0);
        } catch (error) {
            console.error('Erro ao carregar transações recentes:', error);
        }
    }

    async function loadCategoryExpenses(categoriesCard, startDate, endDate) {
        try {
            const categoriesBody = categoriesCard.querySelector('#categories-body');

            // Busca gastos por categoria
            const categories = await API.report.getByCategory(startDate, endDate);

            if (!categories || categories.length === 0) {
                // Mantém o estado vazio
                return;
            }

            // Limpa o conteúdo e cria a lista de categorias
            categoriesBody.innerHTML = '';

            const list = document.createElement('div');
            list.className = 'category-list';

            categories.forEach(item => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';

                categoryItem.innerHTML = `
                    <div class="category-info">
                        <div class="category-name">${item.categoryName || 'Sem categoria'}</div>
                        <div class="category-amount">${Utils.formatCurrency(item.total)}</div>
                    </div>
                    <div class="category-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${item.percentage.toFixed(1)}%"></div>
                        </div>
                        <span class="category-percentage">${item.percentage.toFixed(1)}%</span>
                    </div>
                `;

                list.appendChild(categoryItem);
            });

            categoriesBody.appendChild(list);
        } catch (error) {
            console.error('Erro ao carregar gastos por categoria:', error);
        }
    }

    return {
        render
    };
})();
