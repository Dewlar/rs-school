import './global.scss';
import App from './app/app';

window.onload = (): void => {
  console.log('Project started');

  const app: App = new App();
  app.start();
};
