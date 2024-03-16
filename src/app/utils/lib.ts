import { ICreateNode } from '../models';

export default function createElement<T extends keyof HTMLElementTagNameMap>(
  type: T,
  params?: ICreateNode
): HTMLElementTagNameMap[T] {
  const element = document.createElement(type);
  if (params) {
    if (params.classList) {
      element.classList.add(...params.classList);
    }
    if (params.attrList) {
      if (Object.keys(params.attrList).length) {
        Object.keys(params.attrList).forEach((key) => {
          element.setAttribute(key, params.attrList![key]);
        });
      }
    }
    if (params.textContent) {
      element.textContent = params.textContent;
    }
    if (params.childNodeList) {
      element.append(...params.childNodeList);
    }
  }
  return element;
}
