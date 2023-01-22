import dotenv from 'dotenv';
import start from './services/whatsapp.js';
import { create } from 'venom-bot'

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
    } else if (args.includes('telegram')) {
        console.log("Start telegram bot")
    }
}

startBot()
