const client = require('./services/whatsapp');
const scheduler = require('./services/scheduler');
const db = require('./config/database');
const moment = require('moment');

// Função para limpar agendamentos expirados (agendamentos de datas passadas)
const cleanupExpiredAppointments = () => {
    console.log('--- LIMPANDO AGENDAMENTOS EXPIRADOS ---');
    const now = moment().startOf('day');
    const appointments = db.get('agendamentos').value();
    
    const validAppointments = appointments.filter(app => {
        const appDate = moment(app.data, 'DD/MM/YYYY');
        return appDate.isValid() && appDate.isSameOrAfter(now);
    });

    db.set('agendamentos', validAppointments).write();
    console.log(`--- LIMPEZA CONCLUÍDA: ${appointments.length - validAppointments.length} REMOVIDOS ---`);
};

// Executar limpeza a cada 24 horas
setInterval(cleanupExpiredAppointments, 24 * 60 * 60 * 1000);

// Iniciar o cliente WhatsApp
client.initialize();

// Lidar com mensagens recebidas
client.on('message', async (message) => {
    try {
        // Ignorar mensagens de grupos para não sobrecarregar
        if (message.from.includes('@g.us')) return;

        // Processar mensagem via scheduler
        await scheduler.handleIncomingMessage(client, message);
    } catch (error) {
        console.error('ERRO AO PROCESSAR MENSAGEM:', error);
        await client.sendMessage(message.from, "❌ Ops! Tivemos um erro interno ao processar sua solicitação. Por favor, tente novamente mais tarde.");
    }
});

// Mensagem de boas-vindas ao iniciar
console.log('--- SISTEMA DE AGENDAMENTO SAAS INICIALIZADO ---');
cleanupExpiredAppointments();
