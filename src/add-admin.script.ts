import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserSchema, User } from './users/models/user.model';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);

  const adminFullName = 'admin';
  const adminPhoneNumber = 1234567890;
  const adminEmail = 'admin@demo.com';
  const adminPassword = 'Admin@12345'; // Use a strong password in production

  try {
    const admin = await usersService.createAdmin(adminFullName, adminPhoneNumber, adminEmail, adminPassword);
    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }

  await app.close();
}

bootstrap();
