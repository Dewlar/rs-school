import './app.scss';
import AuthManager from './services/auth-manager';
import { USER_DATA_KEY } from './models';

class App {
  start() {
    AuthManager.initialize();
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData !== null) {
      AuthManager.login();
    } else {
      AuthManager.logout();
    }
  }
}

export default App;
