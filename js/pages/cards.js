// ===================================
// PÁGINA DE CARTÕES
// ===================================

const CardsPage = (() => {
    let cards = [];

    function render() {
        const container = document.createElement('div');
        container.className = 'cards-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Cartões de Crédito</h1>
                    <p class="dashboard-subtitle">Gerencie seus cartões e faturas</p>
                </div>
                <button class="btn btn-primary btn-md" id="add-card-btn">
                    <i data-lucide="plus"></i>
                    <span>Novo Cartão</span>
                </button>
            </div>
        `;
        container.appendChild(header);

        // Grid de cartões
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'grid grid-cols-3';
        cardsGrid.id = 'cards-grid';
        container.appendChild(cardsGrid);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const addBtn = header.querySelector('#add-card-btn');
            addBtn.addEventListener('click', showAddCardModal);

            // Carrega cartões após o DOM estar pronto
            loadCards();
        }, 0);

        return container;
    }

    async function loadCards() {
        const cardsGrid = document.getElementById('cards-grid');
        if (!cardsGrid) return;

        cardsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            cards = await API.card.getAll();
            renderCards();
        } catch (error) {
            console.error('Erro ao carregar cartões:', error);
            cardsGrid.innerHTML = `
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

    function renderCards() {
        const cardsGrid = document.getElementById('cards-grid');
        if (!cardsGrid) return;

        if (cards.length === 0) {
            cardsGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="credit-card"></i></div>
                        <h3 class="empty-state-title">Nenhum cartão</h3>
                        <p class="empty-state-message">Adicione seu primeiro cartão de crédito.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        cardsGrid.innerHTML = '';

        cards.forEach(card => {
            const cardEl = createCardElement(card);
            cardsGrid.appendChild(cardEl);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    function createCardElement(card) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card card-elevated card-padding-md';
        cardEl.style.background = 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)';
        cardEl.style.color = 'white';
        cardEl.style.minHeight = '200px';
        cardEl.style.display = 'flex';
        cardEl.style.flexDirection = 'column';
        cardEl.style.justifyContent = 'space-between';

        const limitUsed = ((card.limit - card.availableLimit) / card.limit) * 100;

        cardEl.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="font-weight: 600;">${card.brand}</span>
                    <button class="btn btn-ghost btn-sm" style="color: white;" onclick="CardsPage.deleteCard('${card.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                <div style="font-size: 1.5rem; font-weight: 600; letter-spacing: 2px; margin-bottom: 0.5rem;">
                    •••• ${card.lastFourDigits}
                </div>
                <div style="font-size: 0.875rem; opacity: 0.9;">${card.name}</div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                    <span>Limite disponível</span>
                    <span>${Utils.formatCurrency(card.availableLimit)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <span>Limite total</span>
                    <span>${Utils.formatCurrency(card.limit)}</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${limitUsed}%; background-color: ${limitUsed > 80 ? 'var(--danger-500)' : 'white'};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">
                    <span>Vencimento: dia ${card.dueDay}</span>
                    <span>Fechamento: dia ${card.closingDay}</span>
                </div>
            </div>
        `;

        return cardEl;
    }

    function showAddCardModal() {
        const modal = UI.Modal({
            title: 'Novo Cartão',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'card-form';
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Nome do cartão</label>
                <input type="text" name="name" class="form-input" placeholder="Meu Cartão" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Bandeira</label>
                    <select name="brand" class="form-select">
                        <option value="">Selecione (opcional)</option>
                        <option value="VISA">Visa</option>
                        <option value="MASTERCARD">Mastercard</option>
                        <option value="ELO">Elo</option>
                        <option value="AMEX">American Express</option>
                        <option value="HIPERCARD">Hipercard</option>
                        <option value="OTHER">Outro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Últimos 4 dígitos</label>
                    <input type="text" name="lastDigits" class="form-input" maxlength="4" pattern="[0-9]{4}" placeholder="1234" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label form-label-required">Limite</label>
                <input type="number" name="limit" step="0.01" min="0.01" class="form-input" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label form-label-required">Dia de fechamento</label>
                    <input type="number" name="closingDay" class="form-input" min="1" max="31" required>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Dia de vencimento</label>
                    <input type="number" name="dueDay" class="form-input" min="1" max="31" required>
                </div>
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
                data.closingDay = parseInt(data.closingDay);
                data.dueDay = parseInt(data.dueDay);

                // Remover campos opcionais vazios
                if (!data.brand) {
                    delete data.brand;
                }
                if (!data.color) {
                    delete data.color;
                }

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.card.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Cartão criado com sucesso!'
                    });
                    modal.close();
                    loadCards();
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

    async function deleteCard(id) {
        if (!confirm('Deseja realmente excluir este cartão?')) return;

        try {
            await API.card.delete(id);
            UI.toast({
                type: 'success',
                message: 'Cartão excluído com sucesso!'
            });
            loadCards();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteCard
    };
})();
