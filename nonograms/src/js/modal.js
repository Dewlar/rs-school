import { createNode } from "./functions-lib";

export class Modal {
  constructor() {
    this.modal = '';
    this.modalContent = '';
    this.modalCloseBtn = '';
    this.overlay = '';
  }

  buildModal(content) {
    //Overlay
    this.overlay = createNode('div', ['overlay']);
    //Modal
    this.modal = createNode('div', ['modal']);
    //Modal content
    this.modalContent = createNode('div', ['modal__content']);
    //Close Button
    this.modalCloseBtn = createNode('span', ['modal__close-icon']);
    this.modalCloseBtn.innerHTML = '<svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.4239 10.5172L20.6009 2.33999C21.1331 1.80809 21.1331 0.948089 20.6009 0.416194C20.069 -0.115701 19.209 -0.115701 18.6771 0.416194L10.4999 8.59343L2.3229 0.416194C1.79076 -0.115701 0.931004 -0.115701 0.399108 0.416194C-0.133036 0.948089 -0.133036 1.80809 0.399108 2.33999L8.5761 10.5172L0.399108 18.6945C-0.133036 19.2263 -0.133036 20.0863 0.399108 20.6182C0.664184 20.8836 1.01272 21.0169 1.361 21.0169C1.70929 21.0169 2.05758 20.8836 2.3229 20.6182L10.4999 12.441L18.6771 20.6182C18.9425 20.8836 19.2907 21.0169 19.639 21.0169C19.9873 21.0169 20.3356 20.8836 20.6009 20.6182C21.1331 20.0863 21.1331 19.2263 20.6009 18.6945L12.4239 10.5172Z" fill="#2F281E"/></svg>';

    this.#setContent(content);

    this.modal.append(this.modalCloseBtn, this.modalContent);
    this.overlay.append(this.modal);

    // Bind Events
    this.overlay.addEventListener('click', (e) => {
      let classes = e.target.classList;
      if (classes.contains('overlay') || classes.contains('modal__close-icon')) {
        this.overlay.remove();
      }
    });

    // Open Modal
    document.body.append(this.overlay);
  }

  #setContent(content) {
    if (typeof content === 'string') {
      this.modalContent.innerHTML = content;
    } else {
      this.modalContent.innerHTML = '';
      this.modalContent.append(content);
    }
  }
}
