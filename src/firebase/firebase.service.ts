import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getStorage, Storage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {

  private bucket: Storage;

  constructor(@Inject('FIREBASE_ADMIN') firebaseApp: admin.app.App, configService: ConfigService) {
    // Initialize Firebase Storage
    this.bucket = getStorage(firebaseApp);
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Generate a unique file name using uuid
      const fileName = `${uuid()}-${file.originalname}`;
      const tempFilePath = path.join(os.tmpdir(), fileName);

      // Write file buffer to a temporary file
      fs.writeFileSync(tempFilePath, file.buffer);

      // Upload the file to Firebase storage
      const [uploadedFile] = await this.bucket.bucket().upload(tempFilePath, {
        destination: `products/${fileName}`,
        public: true,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Remove the temporary file after upload
      fs.unlinkSync(tempFilePath);

      // Return the public URL of the uploaded image
      const imageUrl = `https://storage.googleapis.com/${this.bucket.bucket().name}/products/${fileName}`;
      return imageUrl;
    } catch (error) {
      throw new Error('Error uploading image to Firebase');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('No image URL provided.');
    }
    try {
      // Extract the file name from the image URL
      const fileName = new URL(imageUrl).pathname.split('/').pop();
      const decodedPath = decodeURIComponent(fileName);
      await this.bucket.bucket().file(`products/${decodedPath}`).delete();
    } catch (error) {
      throw new Error(`Failed to delete image from Firebase Storage: ${error.message}`);
    }
  }
}
