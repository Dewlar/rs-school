import News from './news/news';
import Sources from './sources/sources';
import { IArticle, INews, IResponseNews, IResponseSources } from '../../models';

export class AppView {
    constructor(
        private news: News = new News(),
        private sources: Sources = new Sources()
    ) {}

    drawNews(data: IResponseNews) {
        console.log(data);
        const values: INews[] = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: IResponseSources) {
        const values: IArticle[] = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
