import axios from 'axios'

class MangaService {

    async getMangaChapter(title, mangaChapter, retry = 0) {
        try {
            const chapter = await axios.get(`${process.env.MANGA_URL}?title=${title}&chapter=${mangaChapter}`)
            return chapter.data.pages
        } catch (error) {
            console.error(`Error to get manga - ${error}`)
            if (retry < 2) {
                await new Promise(resolve => setTimeout(resolve, 20000)); // wating 20 seconds to retry
                return this.getMangaChapter(title, mangaChapter, retry + 1)
            }
            return []
        }
    }

}

export default new MangaService()