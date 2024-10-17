import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json';


@Module({
  providers: [
    FirebaseService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        // Initialize Firebase Admin SDK with the correct config
        const app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          storageBucket: configService.get<string>('FIREBASE_BUCKET'),
        });

        return app;
      },
      inject: [ConfigService],
    },
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}