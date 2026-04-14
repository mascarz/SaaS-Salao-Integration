const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('--- ESCANEIE O QR CODE ABAIXO ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('--- WHATSAPP CONECTADO E PRONTO! ---');
    // Garante que o bot não fique postando status ou apareça online desnecessariamente
    client.sendPresenceUnavailable();
});

client.on('authenticated', () => {
    console.log('--- AUTENTICAÇÃO REALIZADA COM SUCESSO ---');
});

client.on('auth_failure', (msg) => {
    console.error('--- FALHA NA AUTENTICAÇÃO: ', msg);
});

module.exports = client;
