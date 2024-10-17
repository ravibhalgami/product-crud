# 🚀 NestJS Project: REST API for User & Admin Management

## 📋 Overview

This project is a **NestJS backend** providing REST API endpoints for user signup, login, product management, and admin functionalities. It uses **MongoDB** via **Mongoose ORM** and integrates **Firebase** for image storage.

## 🔧 Requirements

Ensure you have the following installed on your system:

- **Node.js**: `^v18.19.1`
- **NestJS CLI**: `^v10.4.5`
- **MongoDB**: A local or cloud MongoDB instance
- **Firebase Account**: For image storage

## 🚀 Features

### User Features

- **User Registration**: Create a new user account with full validation.
- **User Login**: Login using the registered email and password.
- **Product Management**: Users can perform CRUD operations on products:
  - Create, read, update, and soft delete products.
  - Products include fields for name, description, and image (stored in Firebase).

### Admin Features

- **Admin Dashboard**:
  - View all registered users and manage their activation status (active/inactive).
  - View all products with detailed info on their creators (users).
  - Perform search and filter actions on products and users by keywords and date ranges.

### Security & Authentication

- **JWT Authentication**: Secure login and user sessions with JWT tokens.

### Server-Side Pagination

- **Pagination**: Implement server-side pagination for user and product listings to handle large datasets efficiently.

### Error Handling & API Logging

- **Error Handling**: Proper error messages and response codes for all API routes.
- **Logging**: Log every API request and response, along with execution duration and timestamps, using **Winston**.

### Firebase Integration

- **Firebase**: Integrated for image storage (e.g., product images), ensuring media is handled efficiently.

## ⚙️ Installation

Follow these steps to set up and run the project:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ravibhalgami/product-crud
   cd product-crud
   ```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

- Configure MongoDB, Firebase, JWT, and Winston log directory in your .env file.

3. **Start the development server**:

```bash
npm run start
```

The app will be accessible at http://localhost:3000.

## 🔨 Configuration

You need to set up the NestJS API with the proper environment configuration. Add the following variables in your .env file:

### Example .env

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database
FIREBASE_BUCKET=your-firebase-bucket
JWT_SECRET=your-jwt-secret
JWT_EXPIRED_TIME=1h
WINSTON_LOG_DIR=./logs
```

### Firebase Setup

Make sure to configure Firebase properly and download the firebase-service-account.json file. Place it in the project root directory.

### Setting Up an Admin Account

To access the admin section, you can create an admin account using the credentials admin@demo.com with the password Admin@12345 by running the following command:

```bash
cd product-crud
npx ts-node src/add-admin.script.ts
```

This will set up the account and allow you to verify the admin functionalities.

## 💡 Additional Notes

- Firebase: Ensure Firebase is configured correctly for media storage.
- Logging: All API requests are logged, including request duration and timestamps for debugging and monitoring purposes.
