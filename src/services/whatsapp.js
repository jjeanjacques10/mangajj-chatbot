import commands from '../utils/commands.js'
import logger from '../utils/logger.js';
import MangaService from './manga.service.js';

const mangabot = (client, message) => {
    let command = message.text.indexOf(" ") > -1 ?
        message.text.substring(0, message.text.indexOf(" ")) : message.text

    switch (command) {
        case commands.mangabot:
            const manga = message.text.substring(message.text.indexOf(" "));
            if (manga === null) {
                client.sendText(message.from, "Qual mangá e capítulo você deseja ler? (Exemplo: Naruto 698)")
            } else {
                const mangaName = manga.split(" ").slice(1, -1).join(" ");
                const mangaChapter = manga.split(" ").pop()
                const username = message?.sender?.displayName ?? "Anônimo"

                logger(`${username}: ${message.text}`)
                client.sendText(message.from, `Buscando o capítulo ${mangaChapter} de ${mangaName}...`)

                MangaService.getMangaChapter(mangaName, mangaChapter, 0).then((pages) => {
                    if (pages === null || pages.length === 0) {
                        logger(`${username} response: Capítulo não encontrado: ${mangaName} - ${mangaChapter}`)	
                        client.sendText(message.from, "Capítulo sendo baixado ou não encontrado. Aguarde alguns minutos e tente novamente.")
                        return
                    }
                    let i = 0;
                    function sendNext() {
                        if (i >= pages.length) return;
                        let pageNumber = pages[i].split("=").pop()
                        client.sendImage(
                            message.from === process.env.BOT_NUMBER ? message.to : message.from,
                            pages[i],
                            `mangabot-${mangaName}-${mangaChapter}-page-${pageNumber}`,
                            ''
                        ).catch((error) => {
                            console.log(error)
                            client.sendText(message.from, `Ocorreu um erro ao enviar a página ${pageNumber}. Tente novamente mais tarde.`)
                        })
                        i++;
                        setTimeout(sendNext, 1000); // delay of 1 second
                    }
                    sendNext();
                }).catch((error) => {
                    console.log(error)
                    client.sendText(message.from, "Ocorreu um erro ao buscar o capítulo. Tente novamente mais tarde.")
                })
            }
            break;
        case commands.help:
            client.sendText(message.from, "Comandos disponíveis: \n/mangabot [nome do mangá] [número capítulo] \n\n Exemplo: /mangabot Naruto 698")
            break;
    }

    if (commands.hello.includes(message.text.toLowerCase())) {
        client.sendText(message.from, "Olá! Eu sou o Mangabot. Posso te ajudar a ler mangás. Digite /help para ver os comandos disponíveis.")
        return
    }
    //client.sendText(message.from, "Desculpe, não entendi o que você quis dizer. Digite /help para ver os comandos disponíveis.")
}

export default async function start(client) {
    client.onAnyMessage((message) => mangabot(client, message));
}