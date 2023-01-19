import { create } from 'venom-bot'
import axios from 'axios'


create({
    session: 'mangajj-session',
    multidevice: true
})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro)
    })

const getMangaChapter = async (mangaName, mangaChapter) => {
    try {
        const chapter = await axios.get(`http://localhost:3000/chapter?source=manga_livre&manga=${mangaName}&number=${mangaChapter}`)
        let pagesOrdered = chapter.data.pages.sort((a, b) => {
            var itemA = a.split("=").pop().split("_")[0]
            var itemB = b.split("=").pop().split("_")[0]
            return itemA - itemB
        })
        return pagesOrdered
    } catch (error) {
        return []
    }
}

const mangabot = (client, message) => {
    const commands = {
        mangabot: "/mangabot",
        help: "/help"
    }

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

                getMangaChapter(mangaName, mangaChapter).then((pages) => {
                    if (pages === null || pages.length === 0) {
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
                            `Page ${pageNumber}`
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
            client.sendText(message.from, "Comandos disponíveis: \n/mangabot [nome do mangá] [capítulo]")
            break;
    }
}

async function start(client) {
    client.onAnyMessage((message) => mangabot(client, message));
}