// ===================================
// PÁGINA DE LOGIN
// ===================================

const LoginPage = (() => {
    function render() {
        const container = document.createElement('div');
        container.className = 'auth-container';

        const card = document.createElement('div');
        card.className = 'auth-card';

        card.innerHTML = `
            <div class="auth-logo">
                <h1 class="auth-logo-text">Lyvinx</h1>
            </div>

            <h2 class="auth-title">Bem-vindo de volta!</h2>
            <p class="auth-subtitle">Entre com suas credenciais para acessar sua conta</p>

            <form id="login-form" class="auth-form">
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
                    <div class="form-error" id="password-error"></div>
                </div>

                <button type="submit" class="btn btn-primary btn-md btn-full" id="login-btn">
                    Entrar
                </button>
            </form>

            <div class="auth-footer">
                Não tem uma conta?
                <a href="/register" class="auth-link" data-link>Criar conta</a>
            </div>
        `;

        container.appendChild(card);

        // Inicializa ícones
        setTimeout(() => lucide.createIcons(), 0);

        // Event listeners
        const form = card.querySelector('#login-form');
        form.addEventListener('submit', handleSubmit);

        return container;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const emailInput = form.querySelector('#email');
        const passwordInput = form.querySelector('#password');
        const submitBtn = form.querySelector('#login-btn');

        const emailError = form.querySelector('#email-error');
        const passwordError = form.querySelector('#password-error');

        // Limpa erros
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('has-error');
        passwordInput.classList.remove('has-error');

        // Validação
        let hasError = false;

        if (!emailInput.value) {
            emailError.textContent = 'Email é obrigatório';
            emailInput.classList.add('has-error');
            hasError = true;
        } else if (!Utils.validateEmail(emailInput.value)) {
            emailError.textContent = 'Email inválido';
            emailInput.classList.add('has-error');
            hasError = true;
        }

        if (!passwordInput.value) {
            passwordError.textContent = 'Senha é obrigatória';
            passwordInput.classList.add('has-error');
            hasError = true;
        }

        if (hasError) return;

        // Loading
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = '';

        try {
            await Auth.login({
                email: emailInput.value,
                password: passwordInput.value
            });

            UI.toast({
                type: 'success',
                title: 'Sucesso!',
                message: 'Login realizado com sucesso'
            });

            // Redireciona para dashboard
            Router.navigate('/dashboard');
        } catch (error) {
            UI.toast({
                type: 'error',
                title: 'Erro',
                message: error.message || 'Erro ao fazer login'
            });

            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.textContent = 'Entrar';
        }
    }

    return {
        render
    };
})();
