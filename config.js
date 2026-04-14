require('dotenv').config();

module.exports = {
    adminNumber: process.env.ADMIN_NUMBER || '5544988601067',
    openaiKey: process.env.OPENAI_API_KEY,
    salonName: process.env.SALON_NAME || 'Salão Premium',
    salonLocation: process.env.SALON_LOCATION || 'Endereço não configurado',
    workingHours: {
        start: process.env.START_HOUR || '08:00',
        end: process.env.END_HOUR || '18:00',
        duration: parseInt(process.env.SERVICE_DURATION) || 60
    }
};
