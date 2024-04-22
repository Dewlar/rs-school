export default class User {
  private login: string;

  private password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  getLogin(): string {
    return this.login;
  }

  getPassword(): string {
    return this.password;
  }

  setLogin(login: string): void {
    this.login = login;
  }

  setPassword(password: string): void {
    this.password = password;
  }
}
