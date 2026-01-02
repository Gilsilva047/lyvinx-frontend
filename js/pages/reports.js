// ===================================
// PÁGINA DE RELATÓRIOS
// ===================================

const ReportsPage = (() => {
    function render() {
        const container = document.createElement('div');
        container.className = 'reports-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div>
                <h1 class="dashboard-title">Relatórios</h1>
                <p class="dashboard-subtitle">Análise detalhada das suas finanças</p>
            </div>
        `;
        container.appendChild(header);

        // Filtro de período
        const filterCard = document.createElement('div');
        filterCard.className = 'card card-outlined card-padding-md mb-lg';
        filterCard.innerHTML = `
            <div class="grid grid-cols-3" style="gap: 1rem; align-items: end;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Data Início</label>
                    <input type="date" id="report-start-date" class="form-input">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Data Fim</label>
                    <input type="date" id="report-end-date" class="form-input">
                </div>
                <button class="btn btn-primary btn-md" id="load-reports-btn">
                    <i data-lucide="search"></i>
                    <span>Gerar Relatório</span>
                </button>
            </div>
        `;
        container.appendChild(filterCard);

        // Resumo
        const summaryCard = document.createElement('div');
        summaryCard.className = 'card card-elevated card-padding-md mb-lg';
        summaryCard.id = 'summary-card';
        summaryCard.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';
        container.appendChild(summaryCard);

        // Grid de gráficos
        const chartsGrid = document.createElement('div');
        chartsGrid.className = 'grid grid-cols-2 mb-lg';

        // Card por categoria
        const categoryCard = document.createElement('div');
        categoryCard.className = 'card card-elevated card-padding-none';
        categoryCard.id = 'category-card';
        categoryCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Gastos por Categoria</h3>
            </div>
            <div class="card-body">
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        `;

        // Card por método de pagamento
        const paymentCard = document.createElement('div');
        paymentCard.className = 'card card-elevated card-padding-none';
        paymentCard.id = 'payment-card';
        paymentCard.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Por Método de Pagamento</h3>
            </div>
            <div class="card-body">
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        `;

        chartsGrid.appendChild(categoryCard);
        chartsGrid.appendChild(paymentCard);
        container.appendChild(chartsGrid);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            // Define datas padrão (último mês)
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const startDateInput = filterCard.querySelector('#report-start-date');
            const endDateInput = filterCard.querySelector('#report-end-date');

            startDateInput.value = firstDay.toISOString().split('T')[0];
            endDateInput.value = lastDay.toISOString().split('T')[0];

            const loadBtn = filterCard.querySelector('#load-reports-btn');
            loadBtn.addEventListener('click', () => {
                loadReports(startDateInput.value, endDateInput.value);
            });

            // Carrega dados iniciais
            loadReports(startDateInput.value, endDateInput.value);
        }, 0);

        return container;
    }

    async function loadReports(startDate, endDate) {
        loadSummary(startDate, endDate);
        loadByCategory(startDate, endDate);
        loadByPaymentMethod(startDate, endDate);
    }

    async function loadSummary(startDate, endDate) {
        const summaryCard = document.getElementById('summary-card');
        if (!summaryCard) return;

        summaryCard.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            const summary = await API.report.getSummary(startDate, endDate);

            summaryCard.innerHTML = `
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Resumo do Período</h3>
                <div class="grid grid-cols-4" style="gap: 1.5rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Receitas</div>
                        <div style="font-size: 1.75rem; font-weight: 700; color: var(--success-600);">
                            ${Utils.formatCurrency(summary.totalIncome || 0)}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Despesas</div>
                        <div style="font-size: 1.75rem; font-weight: 700; color: var(--danger-600);">
                            ${Utils.formatCurrency(summary.totalExpense || 0)}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Saldo</div>
                        <div style="font-size: 1.75rem; font-weight: 700; color: ${(summary.balance || 0) >= 0 ? 'var(--success-600)' : 'var(--danger-600)'};">
                            ${Utils.formatCurrency(summary.balance || 0)}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Taxa de Economia</div>
                        <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary-600);">
                            ${(summary.savingsRate || 0).toFixed(1)}%
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erro ao carregar resumo:', error);
            summaryCard.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
                    <h3 class="empty-state-title">Erro ao carregar</h3>
                    <p class="empty-state-message">${error.message}</p>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
        }
    }

    async function loadByCategory(startDate, endDate) {
        const categoryCard = document.getElementById('category-card');
        if (!categoryCard) return;

        const cardBody = categoryCard.querySelector('.card-body');
        cardBody.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            const data = await API.report.getByCategory(startDate, endDate);

            if (!data || data.length === 0) {
                cardBody.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="pie-chart"></i></div>
                        <h3 class="empty-state-title">Sem dados</h3>
                        <p class="empty-state-message">Nenhuma transação encontrada no período.</p>
                    </div>
                `;
                setTimeout(() => lucide.createIcons(), 0);
                return;
            }

            const total = data.reduce((sum, item) => sum + (item.total || 0), 0);

            let html = '';
            data.forEach(item => {
                const percentage = total > 0 ? (item.total / total) * 100 : 0;

                html += `
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">${item.categoryName || item.category?.name || 'Sem categoria'}</span>
                            <span style="font-weight: 700; color: var(--danger-600);">${Utils.formatCurrency(item.total)}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar progress-bar-danger" style="width: ${percentage}%;"></div>
                        </div>
                        <div style="text-align: right; font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                            ${percentage.toFixed(1)}%
                        </div>
                    </div>
                `;
            });

            cardBody.innerHTML = html;
        } catch (error) {
            console.error('Erro ao carregar dados por categoria:', error);
            cardBody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
                    <h3 class="empty-state-title">Erro ao carregar</h3>
                    <p class="empty-state-message">${error.message}</p>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
        }
    }

    async function loadByPaymentMethod(startDate, endDate) {
        const paymentCard = document.getElementById('payment-card');
        if (!paymentCard) return;

        const cardBody = paymentCard.querySelector('.card-body');
        cardBody.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            const data = await API.report.getByPaymentMethod(startDate, endDate);

            if (!data || data.length === 0) {
                cardBody.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="credit-card"></i></div>
                        <h3 class="empty-state-title">Sem dados</h3>
                        <p class="empty-state-message">Nenhuma transação encontrada no período.</p>
                    </div>
                `;
                setTimeout(() => lucide.createIcons(), 0);
                return;
            }

            const total = data.reduce((sum, item) => sum + (item.total || 0), 0);

            const methodLabels = {
                'CASH': 'Dinheiro',
                'DEBIT_CARD': 'Cartão de Débito',
                'CREDIT_CARD': 'Cartão de Crédito',
                'BANK_TRANSFER': 'Transferência',
                'PIX': 'PIX',
                'OTHER': 'Outro'
            };

            let html = '';
            data.forEach(item => {
                const percentage = total > 0 ? (item.total / total) * 100 : 0;

                html += `
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">${methodLabels[item.paymentMethod] || item.paymentMethod}</span>
                            <span style="font-weight: 700; color: var(--primary-600);">${Utils.formatCurrency(item.total)}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${percentage}%;"></div>
                        </div>
                        <div style="text-align: right; font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                            ${percentage.toFixed(1)}%
                        </div>
                    </div>
                `;
            });

            cardBody.innerHTML = html;
        } catch (error) {
            console.error('Erro ao carregar dados por método de pagamento:', error);
            cardBody.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
                    <h3 class="empty-state-title">Erro ao carregar</h3>
                    <p class="empty-state-message">${error.message}</p>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
        }
    }

    return {
        render
    };
})();
