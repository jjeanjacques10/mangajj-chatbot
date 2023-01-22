
import axios from 'axios'

const getMangaChapter = async (mangaName, mangaChapter, retry = 0) => {
    try {
        const chapter = await axios.get(`http://ec2-184-72-101-57.compute-1.amazonaws.com/chapter?source=manga_livre&manga=${mangaName}&number=${mangaChapter}`)
        let pagesOrdered = chapter.data.pages.sort((a, b) => {
            var itemA = a.split("=").pop().split("_")[0]
            var itemB = b.split("=").pop().split("_")[0]
            return itemA - itemB
        })
        return pagesOrdered
    } catch (error) {
        if (retry < 2) {
            await new Promise(resolve => setTimeout(resolve, 20000)); // wating 20 seconds to retry
            return getMangaChapter(mangaName, mangaChapter, retry + 1)
        }
        return []
    }
}

const mangabot = (client, message) => {
    const commands = {
        mangabot: "/mangabot",
        hello: ["oi", "ola", "olá", "eae", "e aí", "eai", "opa", "oi mangabot", "ola mangabot", "olá mangabot", "eae mangabot", "e aí mangabot", "eai mangabot", "opa mangabot"],
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

                client.sendText(message.from, `Buscando o capítulo ${mangaChapter} de ${mangaName}...`)

                getMangaChapter(mangaName, mangaChapter, 0).then((pages) => {
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