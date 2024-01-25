import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  sendNewAppointment = async (data: Message): Promise<boolean> => {
    try {
      const messaging = this.firebaseApp.messaging();
      await messaging.send(data);
      return Promise.resolve(true);
    } catch (error) {
      console.log(`FirebaseService - sendNewAppointment ${JSON.stringify(error)}`)
      return Promise.resolve(false);
    }
  };
}
