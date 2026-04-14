const config = require('../config/config');

const messages = {
    welcome: (name) => {
        return `✨ *Olá, bem-vindo(a) ao ${config.salonName}!* ✨\n\nSou seu assistente virtual e estou aqui para tornar seu agendamento rápido e prático. 💇‍♂️💇‍♀️\n\nComo posso ajudar você hoje?\n\n1️⃣ *Agendar horário*\n2️⃣ *Ver meus agendamentos*\n3️⃣ *Localização do salão*\n4️⃣ *Dúvidas (IA)*\n\n*Por favor, escolha uma opção digitando o número.*`;
    },
    
    askName: "Ótima escolha! Para começarmos, *qual é o seu nome completo?*",
    
    askService: (services) => {
        let text = "Perfeito! Agora, *qual serviço você deseja realizar?*\n\n";
        services.forEach((s, i) => {
            text += `${i + 1}️⃣ *${s.nome}* - R$ ${s.preco}\n`;
        });
        return text;
    },
    
    askDate: "Excelente! Para qual *data* você gostaria de agendar? (Ex: 20/04/2026)",
    
    askTime: "E qual o melhor *horário* para você? (Ex: 14:00)",
    
    invalidOption: "❌ Ops! Essa opção é inválida. Por favor, escolha um dos números do menu.",
    
    invalidDate: "❌ A data informada é inválida ou já passou. Por favor, digite uma data futura no formato DD/MM/AAAA.",
    
    invalidTime: "❌ O horário informado é inválido ou já está ocupado. Por favor, escolha outro horário entre 08:00 e 18:00.",
    
    confirmation: (data) => {
        return `✅ *AGENDAMENTO CONFIRMADO!* ✅\n\n🗓️ *Data:* ${data.data}\n⏰ *Horário:* ${data.hora}\n👤 *Cliente:* ${data.nome}\n✂️ *Serviço:* ${data.servico}\n📍 *Local:* ${config.salonLocation}\n\n*Obrigado pela preferência! Esperamos você.* ✨`;
    },
    
    location: `📍 *Nossa Localização:*\n\n${config.salonLocation}\n\nEsperamos sua visita! ✨`,
    
    adminNotification: (data) => {
        return `📢 *NOVO AGENDAMENTO!* 📢\n\n👤 *Cliente:* ${data.nome}\n✂️ *Serviço:* ${data.servico}\n🗓️ *Data:* ${data.data}\n⏰ *Horário:* ${data.hora}\n📱 *WhatsApp:* ${data.whatsapp}`;
    },
    
    noAppointments: "Você ainda não possui agendamentos futuros. 🗓️",
    
    listAppointments: (appointments) => {
        let text = "🗓️ *Seus Agendamentos:*\n\n";
        appointments.forEach(app => {
            text += `🔹 *${app.servico}*\n   📅 ${app.data} às ${app.hora}\n\n`;
        });
        return text;
    }
};

module.exports = messages;
