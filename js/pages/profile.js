// ===================================
// PÁGINA DE PERFIL
// ===================================

const ProfilePage = (() => {
    function render() {
        const container = document.createElement('div');
        container.className = 'profile-container';

        // Header
        const header = document.createElement('div');
        header.className = 'dashboard-header mb-lg';
        header.innerHTML = `
            <div>
                <h1 class="dashboard-title">Meu Perfil</h1>
                <p class="dashboard-subtitle">Gerencie suas informações pessoais</p>
            </div>
        `;
        container.appendChild(header);

        const user = Auth.getUser();

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-3';
        grid.style.gap = '1.5rem';

        // Card com avatar e info básica
        const avatarCard = document.createElement('div');
        avatarCard.className = 'card card-elevated card-padding-md';
        avatarCard.style.textAlign = 'center';
        avatarCard.innerHTML = `
            <div style="width: 6rem; height: 6rem; border-radius: 50%; background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 2.5rem; margin: 0 auto 1rem;">
                ${Utils.getInitials(user?.name || 'U')}
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${user?.name || 'Usuário'}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${user?.email || ''}</p>
            ${user?.cpf ? `<p style="color: var(--text-secondary); font-size: 0.875rem;">CPF: ${Utils.formatCPF(user.cpf)}</p>` : ''}
        `;
        grid.appendChild(avatarCard);

        // Card de dados pessoais
        const personalCard = document.createElement('div');
        personalCard.className = 'card card-elevated card-padding-md';
        personalCard.style.gridColumn = 'span 2';
        personalCard.innerHTML = `
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem;">Dados Pessoais</h3>
            <form id="profile-form">
                <div class="form-group">
                    <label class="form-label form-label-required">Nome completo</label>
                    <input type="text" name="name" class="form-input" value="${user?.name || ''}" required>
                </div>

                <div class="form-group">
                    <label class="form-label form-label-required">Email</label>
                    <input type="email" name="email" class="form-input" value="${user?.email || ''}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">CPF</label>
                    <input type="text" id="cpf-input" name="cpf" class="form-input" value="${user?.cpf ? Utils.formatCPF(user.cpf) : ''}" maxlength="14">
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary btn-md" id="save-profile-btn">
                        <i data-lucide="save"></i>
                        <span>Salvar Alterações</span>
                    </button>
                </div>
            </form>
        `;
        grid.appendChild(personalCard);

        container.appendChild(grid);

        // Card de segurança
        const securityCard = document.createElement('div');
        securityCard.className = 'card card-elevated card-padding-md mt-lg';
        securityCard.innerHTML = `
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem;">Segurança</h3>
            <form id="password-form">
                <div class="grid grid-cols-3" style="gap: 1rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label form-label-required">Senha atual</label>
                        <input type="password" name="currentPassword" class="form-input" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label form-label-required">Nova senha</label>
                        <input type="password" name="newPassword" class="form-input" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label form-label-required">Confirmar senha</label>
                        <input type="password" name="confirmPassword" class="form-input" required>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary btn-md" id="change-password-btn">
                        <i data-lucide="lock"></i>
                        <span>Alterar Senha</span>
                    </button>
                </div>
            </form>
        `;
        container.appendChild(securityCard);

        // Zona de perigo
        const dangerCard = document.createElement('div');
        dangerCard.className = 'card card-outlined card-padding-md mt-lg';
        dangerCard.style.borderColor = 'var(--danger-600)';
        dangerCard.innerHTML = `
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--danger-600);">Zona de Perigo</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.875rem;">
                Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
            </p>
            <button class="btn btn-danger btn-md" id="delete-account-btn">
                <i data-lucide="trash-2"></i>
                <span>Excluir Conta</span>
            </button>
        `;
        container.appendChild(dangerCard);

        // Event listeners
        setTimeout(() => {
            lucide.createIcons();

            // Máscara CPF
            const cpfInput = personalCard.querySelector('#cpf-input');
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);

                if (value.length > 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                } else if (value.length > 3) {
                    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                }

                e.target.value = value;
            });

            // Form de perfil
            const profileForm = personalCard.querySelector('#profile-form');
            profileForm.addEventListener('submit', handleProfileSubmit);

            // Form de senha
            const passwordForm = securityCard.querySelector('#password-form');
            passwordForm.addEventListener('submit', handlePasswordSubmit);

            // Delete account
            const deleteBtn = dangerCard.querySelector('#delete-account-btn');
            deleteBtn.addEventListener('click', handleDeleteAccount);
        }, 0);

        return container;
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const saveBtn = form.querySelector('#save-profile-btn');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (data.cpf) {
            data.cpf = data.cpf.replace(/\D/g, '');
            if (!Utils.validateCPF(data.cpf)) {
                UI.toast({
                    type: 'error',
                    message: 'CPF inválido'
                });
                return;
            }
        }

        saveBtn.disabled = true;
        saveBtn.classList.add('btn-loading');

        try {
            const updatedUser = await API.user.updateMe(data);

            // Atualiza usuário no localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            UI.toast({
                type: 'success',
                message: 'Perfil atualizado com sucesso!'
            });

            // Recarrega a página para atualizar os dados
            setTimeout(() => {
                Router.navigate('/profile');
            }, 1000);
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        } finally {
            saveBtn.disabled = false;
            saveBtn.classList.remove('btn-loading');
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const saveBtn = form.querySelector('#change-password-btn');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (data.newPassword !== data.confirmPassword) {
            UI.toast({
                type: 'error',
                message: 'As senhas não conferem'
            });
            return;
        }

        if (data.newPassword.length < 6) {
            UI.toast({
                type: 'error',
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
            return;
        }

        saveBtn.disabled = true;
        saveBtn.classList.add('btn-loading');

        try {
            await API.user.updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });

            UI.toast({
                type: 'success',
                message: 'Senha alterada com sucesso!'
            });

            form.reset();
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        } finally {
            saveBtn.disabled = false;
            saveBtn.classList.remove('btn-loading');
        }
    }

    async function handleDeleteAccount() {
        if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            return;
        }

        if (!confirm('ATENÇÃO: Todos os seus dados serão permanentemente excluídos. Confirma a exclusão?')) {
            return;
        }

        try {
            await API.user.deleteMe();

            UI.toast({
                type: 'success',
                message: 'Conta excluída com sucesso'
            });

            // Desloga e redireciona
            await Auth.logout();
            Router.navigate('/login');
        } catch (error) {
            UI.toast({
                type: 'error',
                message: error.message
            });
        }
    }

    return {
        render
    };
})();
