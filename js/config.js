// ===================================
// CONFIGURAÇÃO DA APLICAÇÃO
// ===================================

const CONFIG = (() => {
    // Detecta automaticamente o ambiente
    const isProduction = window.location.hostname !== 'localhost' &&
                        window.location.hostname !== '127.0.0.1';

    // URLs da API
    const API_URLS = {
        development: 'http://localhost:3333/api/v1',
        production: 'https://lynvix-backend.vercel.app/api/v1'
    };

    // Configuração atual baseada no ambiente
    const config = {
        API_URL: isProduction ? API_URLS.production : API_URLS.development,
        ENVIRONMENT: isProduction ? 'production' : 'development',

        // Outras configurações que podem ser úteis
        DEBUG: !isProduction,
        APP_NAME: 'Lyvinx',
        APP_VERSION: '1.0.0'
    };

    // Log da configuração em desenvolvimento
    if (config.DEBUG) {
        console.log('=== CONFIG ===');
        console.log('Environment:', config.ENVIRONMENT);
        console.log('API URL:', config.API_URL);
        console.log('Debug Mode:', config.DEBUG);
        console.log('==============');
    }

    return config;
})();
