import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseProvider } from './firebase.config';
import { FirebaseService } from './firebase.service';

@Module({
    imports: [ConfigModule],
    providers: [firebaseProvider, FirebaseService],
    exports: [FirebaseService],
  })
  export class FirebaseModule {}
