// ===================================
// PÁGINA DE REGISTRO
// ===================================

const RegisterPage = (() => {
    function render() {
        const container = document.createElement('div');
        container.className = 'auth-container';

        const card = document.createElement('div');
        card.className = 'auth-card';

        card.innerHTML = `
            <div class="auth-logo">
                <h1 class="auth-logo-text">Lyvinx</h1>
            </div>

            <h2 class="auth-title">Criar conta</h2>
            <p class="auth-subtitle">Preencha os dados abaixo para criar sua conta</p>

            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label for="name" class="form-label form-label-required">Nome completo</label>
                    <div class="input-wrapper">
                        <i data-lucide="user" class="input-icon input-icon-left"></i>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-input input-with-icon-left"
                            placeholder="Seu nome"
                            required
                        />
                    </div>
                    <div class="form-error" id="name-error"></div>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label form-label-required">Email</label>
                    <div class="input-wrapper">
                        <i data-lucide="mail" class="input-icon input-icon-left"></i>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input input-with-icon-left"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div class="form-error" id="email-error"></div>
                </div>

                <div class="form-group">
                    <label for="cpf" class="form-label">CPF (opcional)</label>
                    <div class="input-wrapper">
                        <i data-lucide="credit-card" class="input-icon input-icon-left"></i>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            class="form-input input-with-icon-left"
                            placeholder="000.000.000-00"
                            maxlength="14"
                        />
                    </div>
                    <div class="form-error" id="cpf-error"></div>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label form-label-required">Senha</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock" class="input-icon input-icon-left"></i>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-input input-with-icon-left"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div class="form-helper">Mínimo de 6 caracteres</div>
                    <div class="form-error" id="password-error"></div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword" class="form-label form-label-required">Confirmar senha</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock" class="input-icon input-icon-left"></i>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            class="form-input input-with-icon-left"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div class="form-error" id="confirmPassword-error"></div>
                </div>

                <button type="submit" class="btn btn-primary btn-md btn-full" id="register-btn">
                    Criar conta
                </button>
            </form>

            <div class="auth-footer">
                Já tem uma conta?
                <a href="/login" class="auth-link" data-link>Fazer login</a>
            </div>
        `;

        container.appendChild(card);

        // Inicializa ícones
        setTimeout(() => lucide.createIcons(), 0);

        // Event listeners
        const form = card.querySelector('#register-form');
        form.addEventListener('submit', handleSubmit);

        // Máscara CPF
        const cpfInput = card.querySelector('#cpf');
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

        return container;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const cpfInput = form.querySelector('#cpf');
        const passwordInput = form.querySelector('#password');
        const confirmPasswordInput = form.querySelector('#confirmPassword');
        const submitBtn = form.querySelector('#register-btn');

        const nameError = form.querySelector('#name-error');
        const emailError = form.querySelector('#email-error');
        const cpfError = form.querySelector('#cpf-error');
        const passwordError = form.querySelector('#password-error');
        const confirmPasswordError = form.querySelector('#confirmPassword-error');

        // Limpa erros
        nameError.textContent = '';
        emailError.textContent = '';
        cpfError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        nameInput.classList.remove('has-error');
        emailInput.classList.remove('has-error');
        cpfInput.classList.remove('has-error');
        passwordInput.classList.remove('has-error');
        confirmPasswordInput.classList.remove('has-error');

        // Validação
        let hasError = false;

        if (!nameInput.value || nameInput.value.trim().length < 3) {
            nameError.textContent = 'Nome deve ter pelo menos 3 caracteres';
            nameInput.classList.add('has-error');
            hasError = true;
        }

        if (!emailInput.value) {
            emailError.textContent = 'Email é obrigatório';
            emailInput.classList.add('has-error');
            hasError = true;
        } else if (!Utils.validateEmail(emailInput.value)) {
            emailError.textContent = 'Email inválido';
            emailInput.classList.add('has-error');
            hasError = true;
        }

        if (cpfInput.value && !Utils.validateCPF(cpfInput.value)) {
            cpfError.textContent = 'CPF inválido';
            cpfInput.classList.add('has-error');
            hasError = true;
        }

        if (!passwordInput.value || passwordInput.value.length < 6) {
            passwordError.textContent = 'Senha deve ter pelo menos 6 caracteres';
            passwordInput.classList.add('has-error');
            hasError = true;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Senhas não conferem';
            confirmPasswordInput.classList.add('has-error');
            hasError = true;
        }

        if (hasError) return;

        // Loading
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = '';

        try {
            const data = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };

            if (cpfInput.value) {
                data.cpf = cpfInput.value.replace(/\D/g, '');
            }

            await Auth.register(data);

            UI.toast({
                type: 'success',
                title: 'Sucesso!',
                message: 'Conta criada com sucesso'
            });

            // Redireciona para dashboard
            Router.navigate('/dashboard');
        } catch (error) {
            UI.toast({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Erro ao criar conta'
            });

            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.textContent = 'Criar conta';
        }
    }

    return {
        render
    };
})();
