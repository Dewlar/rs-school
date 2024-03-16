import './app.scss';
import LoginForm from './components/view/login-form/login-form';

class App {
  start() {
    const login: LoginForm = new LoginForm();
    document.body.append(login.createLoginForm());
  }
}

export default App;
