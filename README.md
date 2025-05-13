# TravelBD Server

This is the backend server for the [TravelBD.com](https://travelbd-158bd.web.app) website, a comprehensive travel platform built using the MERN stack.

## Overview

The TravelBD server is a scalable and efficient server-side application that handles critical backend functionalities including:
- API creation and management
- User authentication and authorization
- Database interactions
- Secure file management
- Payment processing
- Booking management

## API Endpoints

### User Routes (`/api/v1`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /refresh` - Refresh access token
- `GET /user` - Get logged user data
- `PATCH /user` - Update user information
- `PATCH /avatar` - Update user avatar
- `PATCH /change-password` - Change user password
- `GET /users` - Get all users (admin only)
- `DELETE /users/:userId` - Delete user (admin only)

### Hotel Routes (`/api/v1`)
- `GET /hotels` - Get all hotels
- `GET /hotels/:id` - Get hotel by ID
- `GET /hotel-bookings` - Get hotel bookings
- `POST /hotel-booking` - Create hotel booking
- `POST /payment` - Process payment

### Destination Routes (`/api/v1`)
- `GET /destinations` - Get all destinations
- `GET /destinations/:id` - Get destination by ID
- `POST /destination-booking` - Book a destination

### Location Routes (`/api/v1`)
- `GET /locations` - Get all locations

## Technologies Used

### Core Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Tokens)
- Bcrypt for password hashing
- Cookie-based authentication

### File Management
- Multer for file uploads
- Cloudinary for image storage

### Additional Tools
- CORS for cross-origin requests
- Dotenv for environment variables
- Nodemon for development

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
OPTION_SECURE=production
```

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
cd travelbd-server
npm install
```

3. Set up environment variables
```bash
cp env-sample .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
```

## Project Structure
```
travelbd-server/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares
│   ├── utils/          # Utility functions
│   ├── db/             # Database configuration
│   └── app.js          # Express app setup
├── upload/             # Temporary file storage
├── public/             # Static files
└── test/              # Test files
```

## API Response Format

All API responses follow a consistent format:
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

## Error Handling

The server implements a centralized error handling system with custom error classes:
- `ApiError` for custom error responses
- `ApiResponse` for standardized success responses

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Secure cookie handling
- CORS protection
- Input validation
- Rate limiting (optional)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

##