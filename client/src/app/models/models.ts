export interface IUserAuth {
  login: string;
  isLogined: boolean;
}

export interface IMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}
