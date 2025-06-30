# Social Media Backend

A complete Node.js backend API for a social media platform with user authentication, content creation, following system, likes, comments, and content feed functionality.

## 🚀 Features Implemented

### ✅ Core Features
- **User Authentication**: Register, login, and JWT-based authentication
- **User Management**: Profile management, user search, follow/unfollow system
- **Content Creation**: Create, view, and delete posts with media support
- **Content Feed**: Personalized feed showing posts from followed users
- **Like System**: Like/unlike posts with like counts and status tracking
- **Comment System**: Create, edit, delete comments with comment counts
- **Follow System**: Follow/unfollow users with follower/following counts

### 🔧 Technical Features
- **RESTful API**: Complete REST API with proper HTTP methods and status codes
- **Database Design**: Optimized PostgreSQL schema with proper relationships
- **Security**: JWT authentication, input validation, SQL injection protection
- **Performance**: Database indexes, pagination, efficient queries
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: Complete Postman collection for testing

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users/search` - Search users by name/username
- `POST /api/users/:user_id/follow` - Follow a user
- `DELETE /api/users/:user_id/unfollow` - Unfollow a user
- `GET /api/users/following` - Get users you follow
- `GET /api/users/followers` - Get your followers
- `GET /api/users/stats` - Get follow statistics
- `GET /api/users/:user_id` - Get user profile

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/feed` - Get content feed (posts from followed users)
- `GET /api/posts/my` - Get your own posts
- `GET /api/posts/:post_id` - Get a specific post
- `GET /api/posts/user/:user_id` - Get posts by a specific user
- `DELETE /api/posts/:post_id` - Delete a post

### Likes
- `POST /api/likes/:post_id` - Like a post
- `DELETE /api/likes/:post_id` - Unlike a post
- `GET /api/likes/:post_id` - Get likes for a post
- `GET /api/likes/user/me` - Get posts you've liked
- `GET /api/likes/:post_id/count` - Get like count for a post
- `GET /api/likes/:post_id/status` - Check if you've liked a post

### Comments
- `POST /api/comments/:post_id` - Create a comment
- `PUT /api/comments/:comment_id` - Update a comment
- `DELETE /api/comments/:comment_id` - Delete a comment
- `GET /api/comments/:post_id` - Get comments for a post
- `GET /api/comments/:post_id/count` - Get comment count for a post
- `GET /api/comments/single/:comment_id` - Get a specific comment

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb social_media_db

# Run database setup script
npm run setup:db
```

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **posts**: User-generated content
- **follows**: User relationships (who follows whom)
- **likes**: Post likes by users
- **comments**: Post comments by users

All tables include proper foreign key relationships, indexes for performance, and soft delete functionality.

## 🧪 Testing the API

### Using Postman
1. Import the `docs/api-collection.json` file into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: Your JWT token (obtained after login)

### Manual Testing
1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (save the JWT token)
3. Create a post: `POST /api/posts`
4. Follow another user: `POST /api/users/:user_id/follow`
5. View your feed: `GET /api/posts/feed`
6. Like a post: `POST /api/likes/:post_id`
7. Comment on a post: `POST /api/comments/:post_id`

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Authentication and validation middleware
├── models/         # Database models and queries
├── routes/         # API route definitions
├── utils/          # Utility functions (database, JWT, logging)
└── app.js          # Main application file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- SQL injection protection
- CORS configuration
- Helmet security headers
- Rate limiting (can be added)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_very_secure_jwt_secret
```

### Deployment Steps
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database setup: `npm run setup:db`
4. Start the application: `npm start`

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // for paginated responses
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": ["Detailed error information"]
}
```

## 🔄 Available npm Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with nodemon
- `npm run start:verbose` - Start with verbose logging
- `npm run start:critical` - Start with critical-only logging
- `npm run setup:db` - Set up database tables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the API documentation or create an issue in the repository.
