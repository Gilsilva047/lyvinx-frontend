// ===================================
// PÁGINA DE CONTAS
// ===================================

const AccountsPage = (() => {
    let accounts = [];

    function render() {
        const container = document.createElement('div');
        container.className = 'accounts-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Contas Bancárias</h1>
                    <p class="dashboard-subtitle">Gerencie suas contas e saldos</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline btn-md" id="transfer-btn">
                        <i data-lucide="arrow-left-right"></i>
                        <span>Transferir</span>
                    </button>
                    <button class="btn btn-primary btn-md" id="add-account-btn">
                        <i data-lucide="plus"></i>
                        <span>Nova Conta</span>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(header);

        // Grid de contas
        const accountsGrid = document.createElement('div');
        accountsGrid.className = 'grid grid-cols-3';
        accountsGrid.id = 'accounts-grid';
        container.appendChild(accountsGrid);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const addBtn = header.querySelector('#add-account-btn');
            addBtn.addEventListener('click', showAddAccountModal);

            const transferBtn = header.querySelector('#transfer-btn');
            transferBtn.addEventListener('click', showTransferModal);

            // Carrega contas após o DOM estar pronto
            loadAccounts();
        }, 0);

        return container;
    }

    async function loadAccounts() {
        const accountsGrid = document.getElementById('accounts-grid');
        if (!accountsGrid) return;

        accountsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            accounts = await API.account.getAll();
            renderAccounts();
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
            accountsGrid.innerHTML = `
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

    function renderAccounts() {
        const accountsGrid = document.getElementById('accounts-grid');
        if (!accountsGrid) return;

        if (accounts.length === 0) {
            accountsGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="wallet"></i></div>
                        <h3 class="empty-state-title">Nenhuma conta</h3>
                        <p class="empty-state-message">Adicione sua primeira conta bancária.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        accountsGrid.innerHTML = '';

        accounts.forEach(account => {
            const accountEl = createAccountCard(account);
            accountsGrid.appendChild(accountEl);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    function createAccountCard(account) {
        const card = document.createElement('div');
        card.className = 'card card-elevated card-padding-md';

        const typeIcons = {
            'CHECKING': 'landmark',
            'SAVINGS': 'piggy-bank',
            'INVESTMENT': 'trending-up'
        };

        const typeLabels = {
            'CHECKING': 'Conta Corrente',
            'SAVINGS': 'Poupança',
            'INVESTMENT': 'Investimento'
        };

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <i data-lucide="${typeIcons[account.type] || 'wallet'}"></i>
                        <span class="badge badge-primary">${typeLabels[account.type] || account.type}</span>
                    </div>
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${account.name}</h3>
                    <p style="font-size: 0.875rem; color: var(--text-secondary);">${account.bank || 'Banco'}</p>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="AccountsPage.deleteAccount('${account.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>

            <div style="margin-top: 1.5rem;">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Saldo disponível</div>
                <div style="font-size: 2rem; font-weight: 700; color: ${account.balance >= 0 ? 'var(--success-600)' : 'var(--danger-600)'};">
                    ${Utils.formatCurrency(account.balance)}
                </div>
            </div>
        `;

        return card;
    }

    function showAddAccountModal() {
        const modal = UI.Modal({
            title: 'Nova Conta',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'account-form';
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Nome da conta</label>
                <input type="text" name="name" class="form-input" placeholder="Conta Principal" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Banco</label>
                    <input type="text" name="bank" class="form-input" placeholder="Banco do Brasil" required>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Tipo</label>
                    <select name="accountType" class="form-select" required>
                        <option value="CHECKING">Conta Corrente</option>
                        <option value="SAVINGS">Poupança</option>
                        <option value="INVESTMENT">Investimento</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Saldo inicial</label>
                <input type="number" name="balance" step="0.01" class="form-input" value="0" required>
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
                data.balance = parseFloat(data.balance);

                // Remover campos opcionais vazios
                if (!data.color) {
                    delete data.color;
                }

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.account.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Conta criada com sucesso!'
                    });
                    modal.close();
                    loadAccounts();
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

    function showTransferModal() {
        const modal = UI.Modal({
            title: 'Transferir entre Contas',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'transfer-form';

        let optionsHTML = '<option value="">Selecione uma conta</option>';
        accounts.forEach(acc => {
            optionsHTML += `<option value="${acc.id}">${acc.name} - ${Utils.formatCurrency(acc.balance)}</option>`;
        });

        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Conta de origem</label>
                <select name="fromAccountId" class="form-select" required>
                    ${optionsHTML}
                </select>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Conta de destino</label>
                <select name="toAccountId" class="form-select" required>
                    ${optionsHTML}
                </select>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Valor</label>
                <input type="number" name="amount" step="0.01" class="form-input" required>
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
            text: 'Transferir',
            variant: 'primary',
            type: 'submit',
            onClick: async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                data.amount = parseFloat(data.amount);

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.account.transfer(data);
                    UI.toast({
                        type: 'success',
                        message: 'Transferência realizada com sucesso!'
                    });
                    modal.close();
                    loadAccounts();
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

    async function deleteAccount(id) {
        if (!confirm('Deseja realmente excluir esta conta?')) return;

        try {
            await API.account.delete(id);
            UI.toast({
                type: 'success',
                message: 'Conta excluída com sucesso!'
            });
            loadAccounts();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteAccount
    };
})();
