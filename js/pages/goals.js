// ===================================
// PÁGINA DE METAS
// ===================================

const GoalsPage = (() => {
    let goals = [];

    function render() {
        const container = document.createElement('div');
        container.className = 'goals-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Metas</h1>
                    <p class="dashboard-subtitle">Defina e acompanhe suas metas financeiras</p>
                </div>
                <button class="btn btn-primary btn-md" id="add-goal-btn">
                    <i data-lucide="plus"></i>
                    <span>Nova Meta</span>
                </button>
            </div>
        `;
        container.appendChild(header);

        // Grid de metas
        const goalsGrid = document.createElement('div');
        goalsGrid.className = 'grid grid-cols-2';
        goalsGrid.id = 'goals-grid';
        container.appendChild(goalsGrid);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const addBtn = header.querySelector('#add-goal-btn');
            addBtn.addEventListener('click', showAddGoalModal);

            // Carrega metas após o DOM estar pronto
            loadGoals();
        }, 0);

        return container;
    }

    async function loadGoals() {
        const goalsGrid = document.getElementById('goals-grid');
        if (!goalsGrid) return;

        goalsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            goals = await API.goal.getAll();
            renderGoals();
        } catch (error) {
            console.error('Erro ao carregar metas:', error);
            goalsGrid.innerHTML = `
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

    function renderGoals() {
        const goalsGrid = document.getElementById('goals-grid');
        if (!goalsGrid) return;

        if (goals.length === 0) {
            goalsGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="target"></i></div>
                        <h3 class="empty-state-title">Nenhuma meta</h3>
                        <p class="empty-state-message">Adicione sua primeira meta financeira.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        goalsGrid.innerHTML = '';

        goals.forEach(goal => {
            const goalEl = createGoalCard(goal);
            goalsGrid.appendChild(goalEl);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    function createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = 'card card-elevated card-padding-md';

        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const isComplete = progress >= 100;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${goal.name}</h3>
                    ${goal.deadline ? `<p style="font-size: 0.875rem; color: var(--text-secondary);"><i data-lucide="calendar" style="width: 1rem; height: 1rem; display: inline;"></i> ${Utils.formatDate(goal.deadline)}</p>` : ''}
                </div>
                <button class="btn btn-ghost btn-sm" onclick="GoalsPage.deleteGoal('${goal.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>

            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <span>${Utils.formatCurrency(goal.currentAmount)}</span>
                    <span style="font-weight: 600;">${Utils.formatCurrency(goal.targetAmount)}</span>
                </div>
                <div class="progress-bar-container" style="height: 0.75rem;">
                    <div class="progress-bar ${isComplete ? 'progress-bar-success' : ''}" style="width: ${Math.min(progress, 100)}%;"></div>
                </div>
                <div style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem; font-weight: 600; color: ${isComplete ? 'var(--success-600)' : 'var(--text-secondary)'};">
                    ${progress.toFixed(1)}% atingido
                </div>
            </div>

            ${!isComplete ? `
                <button class="btn btn-primary btn-sm btn-full" onclick="GoalsPage.contributeToGoal('${goal.id}', '${goal.name}', ${goal.currentAmount}, ${goal.targetAmount})">
                    <i data-lucide="plus"></i>
                    <span>Contribuir</span>
                </button>
            ` : `
                <div style="text-align: center; padding: 0.5rem; background-color: var(--success-100); color: var(--success-700); border-radius: var(--radius-lg); font-weight: 600;">
                    <i data-lucide="check-circle" style="width: 1rem; height: 1rem; display: inline;"></i> Meta atingida!
                </div>
            `}
        `;

        return card;
    }

    function showAddGoalModal() {
        const modal = UI.Modal({
            title: 'Nova Meta',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'goal-form';
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Nome da meta</label>
                <input type="text" name="name" class="form-input" placeholder="Viagem" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Valor alvo</label>
                    <input type="number" name="targetAmount" step="0.01" class="form-input" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Valor atual</label>
                    <input type="number" name="currentAmount" step="0.01" class="form-input" value="0">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Prazo</label>
                <input type="date" name="deadline" class="form-input">
            </div>

            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea name="description" class="form-input" rows="3" placeholder="Descreva sua meta..."></textarea>
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

                // Converter tipos obrigatórios
                data.targetAmount = parseFloat(data.targetAmount);
                data.currentAmount = parseFloat(data.currentAmount || 0);

                // Converter deadline para ISO datetime se preenchido
                if (data.deadline) {
                    // Converte YYYY-MM-DD para ISO datetime (início do dia UTC)
                    data.deadline = new Date(data.deadline + 'T00:00:00.000Z').toISOString();
                } else {
                    delete data.deadline;
                }

                // Remover campos opcionais vazios
                if (!data.description) {
                    delete data.description;
                }
                if (!data.icon) {
                    delete data.icon;
                }
                if (!data.color) {
                    delete data.color;
                }

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.goal.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Meta criada com sucesso!'
                    });
                    modal.close();
                    loadGoals();
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

    function contributeToGoal(id, name, currentAmount, targetAmount) {
        const modal = UI.Modal({
            title: `Contribuir para: ${name}`,
            size: 'sm'
        });

        const remaining = targetAmount - currentAmount;

        const form = document.createElement('form');
        form.id = 'contribute-form';
        form.innerHTML = `
            <div style="background-color: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-lg); margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">Valor atual:</span>
                    <span style="font-weight: 600;">${Utils.formatCurrency(currentAmount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">Falta:</span>
                    <span style="font-weight: 600; color: var(--primary-600);">${Utils.formatCurrency(remaining)}</span>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Valor da contribuição</label>
                <input type="number" name="amount" step="0.01" class="form-input" required max="${remaining}">
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
            text: 'Contribuir',
            variant: 'primary',
            type: 'submit',
            onClick: async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const amount = parseFloat(formData.get('amount'));

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.goal.contribute(id, amount);
                    UI.toast({
                        type: 'success',
                        message: 'Contribuição realizada com sucesso!'
                    });
                    modal.close();
                    loadGoals();
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

    async function deleteGoal(id) {
        if (!confirm('Deseja realmente excluir esta meta?')) return;

        try {
            await API.goal.delete(id);
            UI.toast({
                type: 'success',
                message: 'Meta excluída com sucesso!'
            });
            loadGoals();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteGoal,
        contributeToGoal
    };
})();
