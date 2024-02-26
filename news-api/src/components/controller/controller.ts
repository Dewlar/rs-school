import AppLoader from './appLoader';
import { Callback } from '../../models/types';
import { Endpoint } from '../../models/enum';

class AppController extends AppLoader {
    getSources<T>(callback: Callback<T>) {
        super.getResp({ endpoint: Endpoint.sources }, callback);
    }

    getNews<T>(e: Event, callback: Callback<T>) {
        let target = e.target as HTMLElement;
        const newsContainer = e.currentTarget as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (!sourceId) throw new Error('sourceId attribute not found');

                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: Endpoint.everything,
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode as HTMLElement;
        }
    }
}

export default AppController;
