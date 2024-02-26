import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { IResponseNews, IResponseSources } from '../../models';

class App {
    constructor(
        private controller = new AppController(),
        private view = new AppView()
    ) {}

    start() {
        (document.querySelector('.sources') as HTMLElement).addEventListener('click', (e) =>
            this.controller.getNews<IResponseNews>(e, (data) => this.view.drawNews(data))
        );
        this.controller.getSources<IResponseSources>((data) => this.view.drawSources(data));
    }
}

export default App;
