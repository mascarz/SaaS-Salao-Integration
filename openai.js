const { OpenAI } = require('openai');
const config = require('../config/config');

class OpenAIService {
    constructor() {
        this.openai = null;
        if (config.openaiKey && config.openaiKey !== 'your_openai_api_key_here') {
            this.openai = new OpenAI({
                apiKey: config.openaiKey
            });
        }
    }

    async generateResponse(userMessage) {
        if (!this.openai) {
            return "Desculpe, o serviço de IA não está configurado no momento. Como posso ajudar você com o agendamento? (Digite 'menu' para ver as opções)";
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `Você é o assistente inteligente do ${config.salonName}. Sua função é tirar dúvidas sobre serviços, preços e horários.
                        
                        Informações importantes:
                        - Nome do Salão: ${config.salonName}
                        - Localização: ${config.salonLocation}
                        - Horário de Funcionamento: 08:00 às 18:00 (Segunda a Sábado)
                        - Serviços Principais: Corte Masculino (R$ 40), Corte Feminino (R$ 70), Barba (R$ 30), Manicure (R$ 60).
                        
                        Responda de forma profissional, educada e curta. Se o cliente quiser agendar, peça para ele digitar 'menu' e escolher a opção 1.`
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 150
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao chamar OpenAI:', error);
            return "Ops! Tive um problema ao processar sua dúvida. Pode tentar novamente em instantes?";
        }
    }
}

module.exports = {
    openaiService: new OpenAIService()
};
