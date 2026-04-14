const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, '../data/agendamentos.json'));
const db = low(adapter);

// Definir padrões (se o arquivo estiver vazio)
db.defaults({
    agendamentos: [],
    usuarios: [], // Para salvar o estado do fluxo de agendamento
    configuracoes: {
        servicos: [
            { id: 1, nome: "Corte de Cabelo Masculino", preco: 40 },
            { id: 2, nome: "Corte de Cabelo Feminino", preco: 70 },
            { id: 3, nome: "Barba Completa", preco: 30 },
            { id: 4, nome: "Manicure & Pedicure", preco: 60 }
        ]
    }
}).write();

module.exports = db;
