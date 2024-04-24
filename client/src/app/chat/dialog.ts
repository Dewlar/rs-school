import Button from '../components/button';
import Input from '../components/input';
import './dialog.scss';

export default class Dialog {
  private readonly container: HTMLDivElement;

  private dialogHeader: HTMLDivElement;

  private dialogContent: HTMLDivElement;

  private dialogInput: HTMLDivElement;

  private input: Input;

  private buttonSubmit: Button;

  private userName: HTMLSpanElement;

  private userStatus: HTMLSpanElement;

  private dialogContentMessage: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.dialogHeader = document.createElement('div');
    this.dialogContent = document.createElement('div');
    this.dialogInput = document.createElement('div');

    this.dialogContentMessage = document.createElement('div');
    this.userName = document.createElement('span');
    this.userStatus = document.createElement('span');

    this.input = new Input('text');
    this.buttonSubmit = new Button('Submit');
    this.setAttribute();
  }

  setAttribute() {
    this.container.className = 'dialog-container';
    this.dialogHeader.className = 'dialog-header';
    this.dialogContent.className = 'dialog-content';
    this.dialogContentMessage.className = 'initial-message';
    this.dialogContentMessage.textContent = 'Please enter your first message';
    this.dialogInput.className = 'dialog-input';
    this.input.node.className = 'input';
    this.input.node.placeholder = 'message';
    this.input.disable();
    this.buttonSubmit.node.className = 'submit-button';
    this.buttonSubmit.disable();

    // this.userName.textContent = 'test-user';
    // this.userStatus.textContent = 'в сети';
    this.userStatus.className = 'user-status';
  }

  get dialogElements() {
    return {
      container: this.container,
      userName: this.userName,
      userStatus: this.userStatus,
      input: this.input,
      buttonSubmit: this.buttonSubmit,
      dialog: this.dialogContent,
      initialMessage: this.dialogContentMessage,
    };
  }

  render() {
    // this.dialogContent.append(this.dialogContentMessage);
    this.dialogHeader.append(this.userName, this.userStatus);
    this.dialogInput.append(this.input.node, this.buttonSubmit.node);
    this.container.append(this.dialogHeader, this.dialogContent, this.dialogInput);
    return this.container;
  }
}
