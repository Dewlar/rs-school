import './app.scss';
import PageManager from './services/page-manager';
import { USER_DATA_KEY } from './models';

class App {
  start() {
    PageManager.initialize();
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData !== null) {
      PageManager.login();
    } else {
      PageManager.logout();
    }
  }
}

export default App;
