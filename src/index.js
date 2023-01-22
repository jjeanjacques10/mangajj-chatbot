import * as dotenv from 'dotenv'
dotenv.config()
import { create } from 'venom-bot'
import start from './services/whatsapp.js';
import startTelegramBot from './services/telegram.js';

function startBot() {
    const args = process.argv

    if (args.includes('whatsapp')) {
        console.log("Start whatsapp bot")
        create({
            session: 'mangajj-session',
            multidevice: true
        })
            .then((client) => start(client))
            .catch((erro) => {
                console.log(erro)
            })
    }
    if (args.includes('telegram')) {
        console.log("Start telegram bot")
        startTelegramBot()
    }
}

startBot()
