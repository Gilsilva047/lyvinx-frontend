// ===================================
// UTILITÁRIOS
// ===================================

const Utils = {
    /**
     * Formata um valor numérico para moeda brasileira
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado em BRL
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    },

    /**
     * Formata uma data para o formato brasileiro
     * @param {string|Date} date - Data a ser formatada
     * @param {boolean} includeTime - Se deve incluir hora
     * @returns {string} - Data formatada
     */
    formatDate(date, includeTime = false) {
        if (!date) return '';

        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (includeTime) {
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(dateObj);
        }

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(dateObj);
    },

    /**
     * Formata um CPF
     * @param {string} cpf - CPF a ser formatado
     * @returns {string} - CPF formatado
     */
    formatCPF(cpf) {
        if (!cpf) return '';

        const cleaned = cpf.replace(/\D/g, '');

        if (cleaned.length !== 11) return cpf;

        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    /**
     * Formata um número de cartão de crédito
     * @param {string} cardNumber - Número do cartão
     * @returns {string} - Número formatado
     */
    formatCardNumber(cardNumber) {
        if (!cardNumber) return '';

        const cleaned = cardNumber.replace(/\D/g, '');

        return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    },

    /**
     * Obtém as iniciais de um nome
     * @param {string} name - Nome completo
     * @returns {string} - Iniciais
     */
    getInitials(name) {
        if (!name) return '';

        const parts = name.trim().split(' ');

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    /**
     * Valida um email
     * @param {string} email - Email a ser validado
     * @returns {boolean} - Se é válido
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Valida um CPF
     * @param {string} cpf - CPF a ser validado
     * @returns {boolean} - Se é válido
     */
    validateCPF(cpf) {
        if (!cpf) return true; // CPF é opcional

        const cleaned = cpf.replace(/\D/g, '');

        if (cleaned.length !== 11) return false;

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleaned)) return false;

        // Validação dos dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleaned.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit > 9) digit = 0;
        if (digit !== parseInt(cleaned.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleaned.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit > 9) digit = 0;
        if (digit !== parseInt(cleaned.charAt(10))) return false;

        return true;
    },

    /**
     * Debounce de uma função
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} - Função com debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Trunca um texto
     * @param {string} text - Texto a ser truncado
     * @param {number} length - Tamanho máximo
     * @returns {string} - Texto truncado
     */
    truncate(text, length = 50) {
        if (!text || text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    /**
     * Gera um ID único
     * @returns {string} - ID único
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Faz uma pausa
     * @param {number} ms - Milissegundos
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Capitaliza a primeira letra
     * @param {string} text - Texto
     * @returns {string} - Texto capitalizado
     */
    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
};
