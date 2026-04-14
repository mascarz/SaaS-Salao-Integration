const moment = require('moment');
const db = require('../config/database');
const messages = require('../utils/messages');
const config = require('../config/config');

const states = {
    IDLE: 'IDLE',
    AWAITING_NAME: 'AWAITING_NAME',
    AWAITING_SERVICE: 'AWAITING_SERVICE',
    AWAITING_DATE: 'AWAITING_DATE',
    AWAITING_TIME: 'AWAITING_TIME',
    AWAITING_AI: 'AWAITING_AI'
};

class SchedulerService {
    constructor() {
        this.db = db;
    }

    getUserState(whatsappId) {
        return this.db.get('usuarios').find({ id: whatsappId }).value() || { id: whatsappId, state: states.IDLE, data: {} };
    }

    updateUserState(whatsappId, state, data = {}) {
        const user = this.getUserState(whatsappId);
        const updatedUser = { ...user, state, data: { ...user.data, ...data } };
        
        const existing = this.db.get('usuarios').find({ id: whatsappId }).value();
        if (existing) {
            this.db.get('usuarios').find({ id: whatsappId }).assign(updatedUser).write();
        } else {
            this.db.get('usuarios').push(updatedUser).write();
        }
    }

    async handleIncomingMessage(client, message) {
        const whatsappId = message.from;
        const text = message.body.trim();
        const user = this.getUserState(whatsappId);

        console.log(`Mensagem de ${whatsappId}: ${text} (Estado: ${user.state})`);

        switch (user.state) {
            case states.IDLE:
                await this.handleIdle(client, message, text);
                break;
            case states.AWAITING_NAME:
                await this.handleAwaitingName(client, message, text);
                break;
            case states.AWAITING_SERVICE:
                await this.handleAwaitingService(client, message, text);
                break;
            case states.AWAITING_DATE:
                await this.handleAwaitingDate(client, message, text);
                break;
            case states.AWAITING_TIME:
                await this.handleAwaitingTime(client, message, text);
                break;
            case states.AWAITING_AI:
                // Se o usuário estiver no modo IA, ele pode sair digitando "sair" ou "menu"
                if (text.toLowerCase() === 'sair' || text.toLowerCase() === 'menu') {
                    this.updateUserState(whatsappId, states.IDLE);
                    await client.sendMessage(whatsappId, messages.welcome());
                } else {
                    // Chamar serviço de IA (será implementado depois)
                    await this.handleAIResponse(client, message, text);
                }
                break;
            default:
                this.updateUserState(whatsappId, states.IDLE);
                await client.sendMessage(whatsappId, messages.welcome());
        }
    }

    async handleIdle(client, message, text) {
        const whatsappId = message.from;
        if (text === '1') {
            this.updateUserState(whatsappId, states.AWAITING_NAME);
            await client.sendMessage(whatsappId, messages.askName);
        } else if (text === '2') {
            const appointments = this.db.get('agendamentos').filter({ whatsapp: whatsappId }).value();
            if (appointments.length > 0) {
                await client.sendMessage(whatsappId, messages.listAppointments(appointments));
            } else {
                await client.sendMessage(whatsappId, messages.noAppointments);
            }
        } else if (text === '3') {
            await client.sendMessage(whatsappId, messages.location);
        } else if (text === '4') {
            this.updateUserState(whatsappId, states.AWAITING_AI);
            await client.sendMessage(whatsappId, "🤖 *Olá! Eu sou a IA do salão. Como posso tirar suas dúvidas hoje?* (Digite 'menu' para voltar)");
        } else {
            await client.sendMessage(whatsappId, messages.welcome());
        }
    }

    async handleAwaitingName(client, message, text) {
        const whatsappId = message.from;
        const services = this.db.get('configuracoes.servicos').value();
        this.updateUserState(whatsappId, states.AWAITING_SERVICE, { nome: text });
        await client.sendMessage(whatsappId, messages.askService(services));
    }

    async handleAwaitingService(client, message, text) {
        const whatsappId = message.from;
        const services = this.db.get('configuracoes.servicos').value();
        const index = parseInt(text) - 1;

        if (index >= 0 && index < services.length) {
            const service = services[index];
            this.updateUserState(whatsappId, states.AWAITING_DATE, { servico: service.nome });
            await client.sendMessage(whatsappId, messages.askDate);
        } else {
            await client.sendMessage(whatsappId, messages.invalidOption);
        }
    }

    async handleAwaitingDate(client, message, text) {
        const whatsappId = message.from;
        const date = moment(text, 'DD/MM/YYYY', true);

        if (date.isValid() && date.isAfter(moment().startOf('day'))) {
            this.updateUserState(whatsappId, states.AWAITING_TIME, { data: text });
            await client.sendMessage(whatsappId, messages.askTime);
        } else {
            await client.sendMessage(whatsappId, messages.invalidDate);
        }
    }

    async handleAwaitingTime(client, message, text) {
        const whatsappId = message.from;
        const user = this.getUserState(whatsappId);
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (timeRegex.test(text)) {
            // Validar se o horário está disponível
            const isOccupied = this.db.get('agendamentos').find({ data: user.data.data, hora: text }).value();
            
            if (isOccupied) {
                await client.sendMessage(whatsappId, messages.invalidTime);
            } else {
                const finalData = {
                    ...user.data,
                    hora: text,
                    whatsapp: whatsappId,
                    id: Date.now()
                };

                // Salvar agendamento
                this.db.get('agendamentos').push(finalData).write();
                this.updateUserState(whatsappId, states.IDLE);

                // Confirmar para o cliente
                await client.sendMessage(whatsappId, messages.confirmation(finalData));

                // Notificar Administrador
                await client.sendMessage(`${config.adminNumber}@c.us`, messages.adminNotification(finalData));
            }
        } else {
            await client.sendMessage(whatsappId, messages.invalidTime);
        }
    }

    async handleAIResponse(client, message, text) {
        // Por enquanto um mock, será integrado com OpenAI no próximo passo
        const { openaiService } = require('./openai');
        const response = await openaiService.generateResponse(text);
        await client.sendMessage(message.from, `🤖 *Assistente IA:* ${response}`);
    }
}

module.exports = new SchedulerService();
