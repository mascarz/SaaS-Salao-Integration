# ✂️ SaaS Salao Integration - Agendamento via WhatsApp ✂️

Sistema de agendamento automático para salões de beleza, totalmente integrado ao WhatsApp utilizando `whatsapp-web.js` e Inteligência Artificial.

## 🚀 Funcionalidades Principais
- 🔹 **Menu Interativo:** Agendar, Ver agendamentos e Localização.
- 🔹 **Agendamento Inteligente:** Fluxo guiado para Nome, Serviço, Data e Hora.
- 🔹 **Validação Automática:** Bloqueio de datas passadas e horários ocupados.
- 🔹 **Persistência de Sessão:** Escaneie o QR Code uma vez e pronto.
- 🔹 **Notificações em Tempo Real:** O dono do salão recebe um alerta a cada novo agendamento.
- 🔹 **Inteligência Artificial (OpenAI):** Respostas automáticas para dúvidas sobre serviços, preços e horários.
- 🔹 **Limpeza de Expirados:** Remove automaticamente agendamentos de datas passadas.

## 🛠️ Tecnologias Utilizadas
- **Node.js** (Ambiente de execução)
- **whatsapp-web.js** (Integração WhatsApp)
- **LowDB** (Banco de dados JSON leve e escalável)
- **OpenAI API** (Inteligência Artificial)
- **Moment.js** (Manipulação de datas)

## 📦 Instalação e Configuração

### 1. Pré-requisitos
- Node.js instalado (v14+)
- Uma conta na OpenAI (opcional, para IA)

### 2. Clone o repositório e instale as dependências
```bash
npm install
```

### 3. Configure o arquivo `.env`
Edite o arquivo `.env` na raiz do projeto:
```env
ADMIN_NUMBER=5544988601067
OPENAI_API_KEY=sua_chave_aqui
SALON_NAME="Salão Premium"
SALON_LOCATION="Rua Exemplo, 123 - Centro, Maringá - PR"
```

### 4. Como Rodar o Bot
Para iniciar o sistema, basta rodar:
```bash
node src/index.js
```
- O terminal exibirá um **QR Code**. Escaneie com seu WhatsApp (Aparelhos Conectados).
- Após o escaneio, a sessão será salva na pasta `.wwebjs_auth`, não sendo necessário escanear novamente.

## 🌐 Como Rodar com Ngrok (Opcional)
Se você deseja expor o sistema ou usar webhooks externos (embora o `whatsapp-web.js` não exija para o bot rodar localmente), use:
```bash
ngrok http 3000
```
*(Nota: Este sistema atual funciona via polling/socket direto com o WhatsApp, não necessitando obrigatoriamente de Ngrok para o fluxo básico).*

## 🏗️ Estrutura SaaS (Multiempresa)
O sistema foi modularizado para facilitar a escalabilidade:
- **Base de Dados:** Cada agendamento e usuário possui seu estado.
- **Configuração:** O arquivo `config.js` pode ser facilmente adaptado para ler configurações de um banco de dados relacional, permitindo que cada `whatsappId` de bot represente um salão diferente.

## 👨‍💻 Desenvolvido por
Criado com ❤️ para ser um sistema premium e escalável.
