// ===================================
// PÁGINA DE TRANSAÇÕES
// ===================================

const TransactionsPage = (() => {
    let transactions = [];
    let isLoading = false;

    function render() {
        const container = document.createElement('div');
        container.className = 'transactions-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Transações</h1>
                    <p class="dashboard-subtitle">Gerencie suas receitas e despesas</p>
                </div>
                <button class="btn btn-primary btn-md" id="add-transaction-btn">
                    <i data-lucide="plus"></i>
                    <span>Nova Transação</span>
                </button>
            </div>
        `;
        container.appendChild(header);

        // Filtros
        const filtersCard = document.createElement('div');
        filtersCard.className = 'card card-outlined card-padding-md mb-lg';
        filtersCard.innerHTML = `
            <div class="grid grid-cols-4" style="gap: 1rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Tipo</label>
                    <select id="filter-type" class="form-select">
                        <option value="">Todos</option>
                        <option value="INCOME">Receita</option>
                        <option value="EXPENSE">Despesa</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Status</label>
                    <select id="filter-status" class="form-select">
                        <option value="">Todos</option>
                        <option value="PAID">Pago</option>
                        <option value="PENDING">Pendente</option>
                        <option value="SCHEDULED">Agendado</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Data Início</label>
                    <input type="date" id="filter-start-date" class="form-input">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label class="form-label">Data Fim</label>
                    <input type="date" id="filter-end-date" class="form-input">
                </div>
            </div>
        `;
        container.appendChild(filtersCard);

        // Tabela de transações
        const tableCard = document.createElement('div');
        tableCard.className = 'card card-elevated card-padding-none';
        tableCard.id = 'transactions-table-card';
        container.appendChild(tableCard);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const addBtn = header.querySelector('#add-transaction-btn');
            addBtn.addEventListener('click', showAddTransactionModal);

            // Filtros
            const filterType = filtersCard.querySelector('#filter-type');
            const filterStatus = filtersCard.querySelector('#filter-status');
            const filterStartDate = filtersCard.querySelector('#filter-start-date');
            const filterEndDate = filtersCard.querySelector('#filter-end-date');

            filterType.addEventListener('change', loadTransactions);
            filterStatus.addEventListener('change', loadTransactions);
            filterStartDate.addEventListener('change', loadTransactions);
            filterEndDate.addEventListener('change', loadTransactions);

            // Carrega transações após o DOM estar pronto
            loadTransactions();
        }, 0);

        return container;
    }

    async function loadTransactions() {
        const tableCard = document.getElementById('transactions-table-card');
        if (!tableCard) return;

        isLoading = true;
        tableCard.innerHTML = '<div class="card-body"><div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div></div>';

        try {
            // Pega filtros
            const params = {};
            const filterType = document.getElementById('filter-type');
            const filterStatus = document.getElementById('filter-status');
            const filterStartDate = document.getElementById('filter-start-date');
            const filterEndDate = document.getElementById('filter-end-date');

            if (filterType?.value) params.type = filterType.value;
            if (filterStatus?.value) params.status = filterStatus.value;
            if (filterStartDate?.value) params.startDate = filterStartDate.value;
            if (filterEndDate?.value) params.endDate = filterEndDate.value;

            transactions = await API.transaction.getAll(params);

            renderTable();
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            tableCard.innerHTML = `
                <div class="card-body">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
                        <h3 class="empty-state-title">Erro ao carregar</h3>
                        <p class="empty-state-message">${error.message}</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
        } finally {
            isLoading = false;
        }
    }

    function renderTable() {
        const tableCard = document.getElementById('transactions-table-card');
        if (!tableCard) return;

        if (!Array.isArray(transactions) || transactions.length === 0) {
            tableCard.innerHTML = `
                <div class="card-body">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="inbox"></i></div>
                        <h3 class="empty-state-title">Nenhuma transação</h3>
                        <p class="empty-state-message">Adicione sua primeira transação para começar.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        let tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        transactions.forEach(transaction => {
            const typeVariant = transaction.type === 'INCOME' ? 'success' : 'danger';
            const statusMap = {
                'PAID': 'success',
                'PENDING': 'warning',
                'SCHEDULED': 'info'
            };
            const statusVariant = statusMap[transaction.status] || 'secondary';

            tableHTML += `
                <tr>
                    <td>${Utils.formatDate(transaction.date)}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category?.name || '-'}</td>
                    <td><span class="badge badge-${typeVariant}">${transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}</span></td>
                    <td>
                        <select
                            class="form-select"
                            style="padding: 0.25rem 2rem 0.25rem 0.5rem; font-size: 0.875rem; min-width: 120px;"
                            onchange="TransactionsPage.updateStatus('${transaction.id}', this.value, '${transaction.status}')"
                            data-transaction-id="${transaction.id}"
                        >
                            <option value="PENDING" ${transaction.status === 'PENDING' ? 'selected' : ''}>Pendente</option>
                            <option value="SCHEDULED" ${transaction.status === 'SCHEDULED' ? 'selected' : ''}>Agendado</option>
                            <option value="PAID" ${transaction.status === 'PAID' ? 'selected' : ''}>Pago</option>
                        </select>
                    </td>
                    <td style="font-weight: 600; color: ${transaction.type === 'INCOME' ? 'var(--success-600)' : 'var(--danger-600)'}">
                        ${transaction.type === 'INCOME' ? '+' : '-'} ${Utils.formatCurrency(transaction.amount)}
                    </td>
                    <td>
                        <button class="btn btn-ghost btn-sm" onclick="TransactionsPage.editTransaction('${transaction.id}')">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="TransactionsPage.deleteTransaction('${transaction.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        tableCard.innerHTML = tableHTML;
        setTimeout(() => lucide.createIcons(), 0);
    }

    function getStatusLabel(status) {
        const labels = {
            'PAID': 'Pago',
            'PENDING': 'Pendente',
            'SCHEDULED': 'Agendado'
        };
        return labels[status] || status;
    }

    function showAddTransactionModal() {
        const modal = UI.Modal({
            title: 'Nova Transação',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'transaction-form';
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Descrição</label>
                <input type="text" name="description" class="form-input" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Tipo</label>
                    <select name="type" class="form-select" required>
                        <option value="EXPENSE">Despesa</option>
                        <option value="INCOME">Receita</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Valor</label>
                    <input type="number" name="amount" step="0.01" class="form-input" required>
                </div>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Data</label>
                    <input type="date" name="date" class="form-input" required value="${new Date().toISOString().split('T')[0]}">
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Status</label>
                    <select name="status" class="form-select" required>
                        <option value="PAID">Pago</option>
                        <option value="PENDING">Pendente</option>
                        <option value="SCHEDULED">Agendado</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Forma de Pagamento</label>
                    <select name="paymentMethod" class="form-select" required>
                        <option value="PIX">PIX</option>
                        <option value="CASH">Dinheiro</option>
                        <option value="DEBIT_CARD">Cartão de Débito</option>
                        <option value="CREDIT_CARD">Cartão de Crédito</option>
                        <option value="BANK_SLIP">Boleto</option>
                        <option value="TRANSFER">Transferência</option>
                        <option value="OTHER">Outro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Categoria</label>
                    <select name="categoryId" class="form-select" required id="transaction-category-select">
                        <option value="">Carregando...</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Observações</label>
                <textarea name="notes" class="form-input" rows="3"></textarea>
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

                // Converte valor para número
                data.amount = parseFloat(data.amount);

                // Converte data para ISO datetime (adiciona horário)
                data.date = new Date(data.date + 'T12:00:00.000Z').toISOString();

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.transaction.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Transação criada com sucesso!'
                    });
                    modal.close();
                    loadTransactions();
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

        // Carrega categorias
        loadCategoriesForSelect();
    }

    async function loadCategoriesForSelect() {
        try {
            const categories = await API.category.getAll();
            const select = document.getElementById('transaction-category-select');
            if (!select) return;

            select.innerHTML = '<option value="">Selecione uma categoria</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    }

    async function updateStatus(transactionId, newStatus, oldStatus) {
        // Se o status não mudou, não faz nada
        if (newStatus === oldStatus) return;

        try {
            // Desabilita o select durante a atualização
            const select = document.querySelector(`select[data-transaction-id="${transactionId}"]`);
            if (select) {
                select.disabled = true;
            }

            await API.transaction.updateStatus(transactionId, newStatus);

            UI.toast({
                type: 'success',
                message: 'Status atualizado com sucesso!'
            });

            // Recarrega as transações
            loadTransactions();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            UI.toast({
                type: 'error',
                message: error.message || 'Erro ao atualizar status'
            });

            // Reverte o select para o valor anterior
            const select = document.querySelector(`select[data-transaction-id="${transactionId}"]`);
            if (select) {
                select.value = oldStatus;
                select.disabled = false;
            }
        }
    }

    async function deleteTransaction(id) {
        if (!confirm('Deseja realmente excluir esta transação?')) return;

        try {
            await API.transaction.delete(id);
            UI.toast({
                type: 'success',
                message: 'Transação excluída com sucesso!'
            });
            loadTransactions();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteTransaction,
        updateStatus,
        editTransaction: (id) => {
            UI.toast({
                type: 'info',
                message: 'Edição em desenvolvimento'
            });
        }
    };
})();
