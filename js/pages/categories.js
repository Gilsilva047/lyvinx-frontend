// ===================================
// PÁGINA DE CATEGORIAS
// ===================================

const CategoriesPage = (() => {
    let categories = [];

    function render() {
        const container = document.createElement('div');
        container.className = 'categories-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 class="dashboard-title">Categorias</h1>
                    <p class="dashboard-subtitle">Organize suas transações por categorias</p>
                </div>
                <button class="btn btn-primary btn-md" id="add-category-btn">
                    <i data-lucide="plus"></i>
                    <span>Nova Categoria</span>
                </button>
            </div>
        `;
        container.appendChild(header);

        // Grid de categorias
        const categoriesGrid = document.createElement('div');
        categoriesGrid.className = 'grid grid-cols-4';
        categoriesGrid.id = 'categories-grid';
        container.appendChild(categoriesGrid);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            const addBtn = header.querySelector('#add-category-btn');
            addBtn.addEventListener('click', showAddCategoryModal);

            // Carrega categorias após o DOM estar pronto
            loadCategories();
        }, 0);

        return container;
    }

    async function loadCategories() {
        const categoriesGrid = document.getElementById('categories-grid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><div class="loading-spinner"></div></div>';

        try {
            categories = await API.category.getAll();
            renderCategories();
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            categoriesGrid.innerHTML = `
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

    function renderCategories() {
        const categoriesGrid = document.getElementById('categories-grid');
        if (!categoriesGrid) return;

        if (categories.length === 0) {
            categoriesGrid.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="tag"></i></div>
                        <h3 class="empty-state-title">Nenhuma categoria</h3>
                        <p class="empty-state-message">Adicione sua primeira categoria.</p>
                    </div>
                </div>
            `;
            setTimeout(() => lucide.createIcons(), 0);
            return;
        }

        categoriesGrid.innerHTML = '';

        categories.forEach(category => {
            const categoryEl = createCategoryCard(category);
            categoriesGrid.appendChild(categoryEl);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'card card-elevated card-padding-md';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background-color: ${category.color || '#0ea5e9'}20; color: ${category.color || '#0ea5e9'}; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 1.5rem;">
                        <i data-lucide="${category.icon || 'tag'}"></i>
                    </div>
                    <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">${category.name}</h3>
                    ${category.isDefault ? '<span class="badge badge-info" style="font-size: 0.75rem;">Padrão</span>' : ''}
                </div>
                ${!category.isDefault ? `
                    <button class="btn btn-ghost btn-sm" onclick="CategoriesPage.deleteCategory('${category.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                ` : ''}
            </div>
        `;

        return card;
    }

    function showAddCategoryModal() {
        const modal = UI.Modal({
            title: 'Nova Categoria',
            size: 'md'
        });

        const form = document.createElement('form');
        form.id = 'category-form';
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label form-label-required">Nome</label>
                <input type="text" name="name" class="form-input" placeholder="Alimentação" required>
            </div>

            <div class="grid grid-cols-2">
                <div class="form-group">
                    <label class="form-label">Ícone</label>
                    <input type="text" name="icon" class="form-input" placeholder="shopping-cart" value="tag">
                    <div class="form-helper">Nome do ícone Lucide</div>
                </div>

                <div class="form-group">
                    <label class="form-label">Cor</label>
                    <input type="color" name="color" class="form-input" value="#0ea5e9">
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

                saveBtn.disabled = true;
                saveBtn.classList.add('btn-loading');

                try {
                    await API.category.create(data);
                    UI.toast({
                        type: 'success',
                        message: 'Categoria criada com sucesso!'
                    });
                    modal.close();
                    loadCategories();
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

    async function deleteCategory(id) {
        if (!confirm('Deseja realmente excluir esta categoria?')) return;

        try {
            await API.category.delete(id);
            UI.toast({
                type: 'success',
                message: 'Categoria excluída com sucesso!'
            });
            loadCategories();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render,
        deleteCategory
    };
})();
