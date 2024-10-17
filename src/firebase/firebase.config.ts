import { initializeApp, cert } from 'firebase-admin/app';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as serviceAccount from '../../firebase-service-account.json';
import { ConfigService } from '@nestjs/config';

export const firebaseApp = (configService: ConfigService) => {
  return initializeApp({
    credential: cert(serviceAccount as admin.ServiceAccount),
    storageBucket: configService.get<string>('FIREBASE_BUCKET'),
  });
};