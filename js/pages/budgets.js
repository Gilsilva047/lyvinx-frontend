// ===================================
// PÁGINA DE ORÇAMENTOS
// ===================================

const BudgetsPage = (() => {
    let budgets = [];

    function render() {
        const container = document.createElement('div');
        container.className = 'budgets-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Orçamentos</h1>
                    <p class="dashboard-subtitle">Controle seus gastos por categoria</p>
                </div>
                <button class="btn btn-primary btn-md" id="add-budget-btn">
                    <i data-lucide="plus"></i>
                    <span>Novo Orçamento</span>
                </button>
            </div>
        `;
        container.appendChild(header);

        // Grid de orçamentos
        const budgetsGrid = document.createElement('div');
        budgetsGrid.className = 'grid grid-cols-2';
        budgetsGrid.id = 'budgets-grid';
        container.appendChild(budgetsGrid);

        // Event listeners - adicionar imediatamente após inserir no DOM
        const addBtn = header.querySelector('#add-budget-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                showAddBudgetModal();
            });
        }

        // Inicializar ícones
        setTimeout(() => {
            lucide.createIcons();

            // Carrega orçamentos após o DOM estar pronto
            loadBudgets();
        }, 0);

        return container;
    }

    async function loadBudgets() {
        const budgetsGrid = document.getElementById('budgets-grid');
        if (!budgetsGrid) return;

        budgetsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            budgets = await API.budget.getAll();
            renderBudgets();
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            budgetsGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
                        <h3 class="empty-state-title">Erro ao carregar</h3>
                        <p class="empty-state-message">${error.message}</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
        }
    }

    function renderBudgets() {
        const budgetsGrid = document.getElementById('budgets-grid');
        if (!budgetsGrid) return;

        if (budgets.length === 0) {
            budgetsGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="pie-chart"></i></div>
                        <h3 class="empty-state-title">Nenhum orçamento</h3>
                        <p class="empty-state-message">Adicione seu primeiro orçamento.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        budgetsGrid.innerHTML = '';

        budgets.forEach(budget => {
            const budgetEl = createBudgetCard(budget);
            budgetsGrid.appendChild(budgetEl);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    function createBudgetCard(budget) {
        const card = document.createElement('div');
        card.className = 'card card-elevated card-padding-md';

        const percentage = (budget.spent / budget.limit) * 100;
        const remaining = budget.limit - budget.spent;

        let statusColor = 'var(--success-600)';
        let statusText = 'No limite';
        let progressClass = '';

        if (percentage >= 100) {
            statusColor = 'var(--danger-600)';
            statusText = 'Estourou!';
            progressClass = 'progress-bar-danger';
        } else if (percentage >= 90) {
            statusColor = 'var(--danger-600)';
            statusText = 'Quase estourando';
            progressClass = 'progress-bar-danger';
        } else if (percentage >= 70) {
            statusColor = 'var(--warning-600)';
            statusText = 'Atenção';
            progressClass = 'progress-bar-warning';
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${budget.category?.name || 'Categoria'}</h3>
                    <span class="badge badge-${percentage >= 90 ? 'danger' : percentage >= 70 ? 'warning' : 'success'}">${statusText}</span>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="BudgetsPage.deleteBudget('${budget.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>

            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <span>Gasto: ${Utils.formatCurrency(budget.spent)}</span>
                    <span style="font-weight: 600;">Limite: ${Utils.formatCurrency(budget.limit)}</span>
                </div>
                <div class="progress-bar-container" style="height: 0.75rem;">
                    <div class="progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%;"></div>
                </div>
                <div style="text-align: center; margin-top: 0.5rem;">
                    <span style="font-size: 1.25rem; font-weight: 700; color: ${statusColor};">
                        ${percentage.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background-color: var(--bg-secondary); border-radius: var(--radius-lg);">
                <span style="color: var(--text-secondary); font-size: 0.875rem;">Disponível</span>
                <span style="font-weight: 600; color: ${remaining > 0 ? 'var(--success-600)' : 'var(--danger-600)'};">
                    ${Utils.formatCurrency(Math.max(remaining, 0))}
                </span>
            </div>
        `;

        return card;
    }

    async function showAddBudgetModal() {
        const modal = UI.Modal({
            title: 'Novo Orçamento',
            size: 'md'
        });

        // Carrega categorias
        let categories = [];
        try {
            categories = await API.category.getAll();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: 'Erro ao carregar categorias'
            });
            return;
        }

        const form = document.createElement('form');
        form.id = 'budget-form';

        let categoriesHTML = '<option value="">Selecione uma categoria</option>';
        categories.forEach(cat => {
            categoriesHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });

        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Categoria</label>
                <select name="categoryId" class="form-select" required>
                    ${categoriesHTML}
                </select>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Limite mensal</label>
                <input type="number" name="limit" step="0.01" class="form-input" required>
            </div>
        `;

        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.gap = '0.5rem';
        footer.style.justifyContent = 'flex-end';

        const cancelBtn = UI.Button({
            text: 'Cancelar',
            variant: 'outline',
            onClick: () => modal.close()
        });

        const saveBtn = UI.Button({
            text: 'Salvar',
            variant: 'primary',
            type: 'submit',
            onClick: async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                // Converter tipos
                data.limit = parseFloat(data.limit);

                // Validar se categoria foi selecionada
                if (!data.categoryId) {
                    UI.toast({
                        type: 'error',
                        message: 'Selecione uma categoria'
                    });
                    return;
                }

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.budget.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Orçamento criado com sucesso!'
                    });
                    modal.close();
                    loadBudgets();
                } catch (error) {
                    UI.toast({
                        type: 'error',
                        message: error.message
                    });
                    saveBtn.disabled = false;
                    saveBtn.classList.remove('btn-loading');
                }
            }
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        modal.setContent(form);
        modal.setFooter(footer);
        modal.open();
    }

    async function deleteBudget(id) {
        if (!confirm('Deseja realmente excluir este orçamento?')) return;

        try {
            await API.budget.delete(id);
            UI.toast({
                type: 'success',
                message: 'Orçamento excluído com sucesso!'
            });
            loadBudgets();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteBudget
    };
})();
