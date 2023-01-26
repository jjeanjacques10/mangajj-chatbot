import axios from 'axios'

class MangaService {

    async getMangaChapter(mangaName, mangaChapter, retry = 0) {
        try {
            const chapter = await axios.get(`http://ec2-184-72-101-57.compute-1.amazonaws.com/chapter?source=manga_livre&manga=${mangaName}&number=${mangaChapter}`)
            return chapter.data.pages
        } catch (error) {
            if (retry < 2) {
                await new Promise(resolve => setTimeout(resolve, 20000)); // wating 20 seconds to retry
                return this.getMangaChapter(mangaName, mangaChapter, retry + 1)
            }
            return []
        }
    }

}

export default new MangaService()