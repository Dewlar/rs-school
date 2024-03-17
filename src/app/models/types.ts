export interface ICreateNode {
  classList?: ClassList;
  attrList?: AttrList;
  childNodeList?: Node[];
  textContent?: string;
}

interface AttrList {
  [key: string]: string;
}

type ClassList = string[];
export type Callback = (...args: unknown[]) => void;
