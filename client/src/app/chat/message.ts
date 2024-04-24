import './message.scss';

export default class Message {
  private readonly container: HTMLDivElement;

  private readonly message: HTMLDivElement;

  private readonly header: HTMLDivElement;

  private readonly footer: HTMLDivElement;

  private readonly messageText: HTMLDivElement;

  private readonly from: HTMLSpanElement;

  private readonly time: HTMLSpanElement;

  private readonly delivered: HTMLSpanElement;

  private readonly readed: HTMLSpanElement;

  private readonly edited: HTMLSpanElement;

  constructor(
    private id: string,
    from: string,
    to: string,
    time: string,
    messageText: string,
    delivered: boolean,
    readed: boolean,
    edited: boolean
  ) {
    this.container = document.createElement('div');
    this.message = document.createElement('div');
    this.header = document.createElement('div');
    this.messageText = document.createElement('div');
    this.footer = document.createElement('div');

    this.from = document.createElement('span');
    this.time = document.createElement('span');

    this.delivered = document.createElement('span');
    this.readed = document.createElement('span');
    this.edited = document.createElement('span');

    this.setAttribute(from, time, messageText, delivered, readed, edited);
  }

  setAttribute(from: string, time: string, messageText: string, delivered: boolean, readed: boolean, edited: boolean) {
    this.container.className = 'message-container';
    this.message.className = 'message';
    this.header.className = 'message-header';
    this.footer.className = 'message-footer';
    this.messageText.className = 'message-text';

    this.from.textContent = from;
    this.time.textContent = time;
    this.messageText.textContent = messageText;
    this.delivered.textContent = delivered ? 'delivered' : 'not delivered';
    this.readed.textContent = readed ? 'readed' : 'not readed';
    this.edited.textContent = edited ? 'edited' : '';
  }

  get elements() {
    return {
      id: this.id,
      container: this.container,
      edited: this.edited,
      readed: this.readed,
      delivered: this.delivered,
      from: this.from,
      time: this.time,
      messageText: this.messageText,
      message: this.message,
    };
  }

  render() {
    this.header.append(this.from, this.time);
    this.footer.append(this.readed, this.edited, this.delivered);
    this.message.append(this.header, this.messageText, this.footer);
    this.container.append(this.message);
    return this.container;
  }
}
