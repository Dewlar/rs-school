import { Status } from './enum';
import { INews } from './news.model';
import { IArticle } from './source.model';

export interface IResponseNews {
    status: Status;
    totalResults: number;
    articles: INews[];
}

export interface IResponseSources {
    status: Status;
    sources: IArticle[];
}
