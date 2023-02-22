import TelegramBot from 'node-telegram-bot-api'

import commands from '../utils/commands.js'
import logger from '../utils/logger.js';
import MangaService from './manga.service.js';

export default function startTelegramBot() {

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const HELLO_MESSAGE = "Olá, eu sou o Mangabot! \n\nPara saber os comandos disponíveis, digite /help"

    const bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/mangabot (.+) (.+)/, (msg, request) => {
        const chatId = msg.chat.id
        const manga = request[1]
        const chapter = request[2]
        logger(`${msg.from.username}: ${msg.text}`)
        get_manga_images(bot, chatId, manga, chapter)
    })

    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id
        const request = callbackQuery.data.split(" ")
        const manga = request[1]
        const chapter = request[2]
        logger(`${callbackQuery.from.username}: ${callbackQuery.data}`)
        get_manga_images(bot, chatId, manga, chapter)
    })

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;

        logger(`${msg.from.username}: ${msg.text}`)
        bot.sendMessage(chatId, "Comandos disponíveis: \n/mangabot [nome do mangá] [número capítulo] \n\n Exemplo: /mangabot Naruto 698");
    })

    commands.hello.map((command) => {
        bot.onText(new RegExp(command, 'i'), (msg) => {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, HELLO_MESSAGE);
        })
    })

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;

        logger(`${msg.from.username}: ${msg.text}`)
        bot.sendMessage(chatId, HELLO_MESSAGE);
    })

}

function get_manga_images(bot, chatId, manga, chapter) {
    bot.sendMessage(chatId, `Buscando o capítulo ${chapter} de ${manga}...`);

    MangaService.getMangaChapter(manga, chapter, 0).then((pages) => {
        if (pages === null || pages.length === 0) {
            logger(`${msg.from.username} response: Capítulo não encontrado: ${manga} - ${chapter}`)
            bot.sendMessage(chatId, "Capítulo sendo baixado ou não encontrado. Aguarde alguns minutos e tente novamente.")
            return
        }
        let i = 0;
        function sendNext() {
            if (i >= pages.length) {
                ask_for_next_chapter(bot, chatId, manga, chapter);
                return;
            }
            let pageNumber = pages[i].split("=").pop();
            bot.sendPhoto(chatId, pages[i]).catch((error) => {
                console.error(error);
                bot.sendMessage(chatId, `Ocorreu um erro ao enviar a página ${pageNumber}. Tente novamente mais tarde.`)
            })
            i++;
            if (i >= pages.length) {
                setTimeout(() => {
                    ask_for_next_chapter(bot, chatId, manga, chapter);
                }, 1000);
            } else {
                setTimeout(sendNext, 1000); // delay of 1 second
            }
        }
        sendNext();
    }).catch((error) => {
        console.error(error)
        bot.sendMessage(chatId, "Ocorreu um erro ao buscar o capítulo. Tente novamente mais tarde.")
    })
}

function ask_for_next_chapter(bot, chatId, manga, chapter) {
    const textNextChapter = `/mangabot ${manga} ${parseInt(chapter) + 1}`

    setTimeout(() => {
        bot.sendMessage(chatId, "Deseja seguir para o próximo capítulo?", {
            reply_markup: {
                inline_keyboard: [[
                    { text: textNextChapter, callback_data: textNextChapter }
                ]]
            }
        })
    }, 7000)
}