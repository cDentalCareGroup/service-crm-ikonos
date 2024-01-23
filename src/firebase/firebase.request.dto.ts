import { Message } from 'firebase-admin/lib/messaging/messaging-api';

export class FirebaseRequestDTO {
  token: string;
  title: string;
  body: string;
  type: string;
  folio: string;

  constructor(
    token: string,
    title: string,
    body: string,
    type: string,
    folio: string,
  ) {
    this.token = token;
    this.title = title;
    this.body = body;
    this.type = type;
    this.folio = folio;
  }
}

export const firebaseRequestToMessage = (data: FirebaseRequestDTO): Message => {
  const message = {
    notification: {
      title: data.title,
      body: data.body,
    },
    data: {
      type: data.type,
      folio: data.folio,
    },
    token: data.token,
  };
  return message;
};
