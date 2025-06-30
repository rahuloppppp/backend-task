# Development Guide - Social Media Backend

## Database Entity Relationship (ER) Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   follows   │       │    posts    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ username    │       │ follower_id │──────▶│ user_id     │◀─────┐
│ email       │       │ following_id│◀──────│ content     │      │
│ password_hash│      │ created_at  │       │ media_url   │      │
│ full_name   │       └─────────────┘       │ comments_enabled│   │
│ is_deleted  │                              │ is_deleted  │   │
│ created_at  │                              │ created_at  │   │
│ updated_at  │                              │ updated_at  │   │
└─────────────┘                              └─────────────┘   │
                                                               │
┌─────────────┐       ┌─────────────┐                         │
│    likes    │       │  comments   │                         │
├─────────────┤       ├─────────────┤                         │
│ id (PK)     │       │ id (PK)     │                         │
│ user_id     │──────▶│ user_id     │─────────────────────────┘
│ post_id     │◀──────│ post_id     │◀──────┐
│ created_at  │       │ content     │       │
└─────────────┘       │ is_deleted  │       │
                      │ created_at  │       │
                      │ updated_at  │       │
                      └─────────────┘       │
                                             │
                      ┌─────────────┐       │
                      │   users     │       │
                      │ (followers) │───────┘
                      └─────────────┘
```

## Key Relationships

1. **users** → **posts**: One-to-Many (a user can create many posts)
2. **users** → **follows** → **users**: Many-to-Many (users can follow multiple users)
3. **users** → **likes** → **posts**: Many-to-Many (users can like multiple posts)
4. **users** → **comments** → **posts**: Many-to-Many (users can comment on multiple posts)

## Database Constraints

- **Foreign Key Constraints**: All relationships are properly enforced
- **Unique Constraints**: 
  - `users.username` and `users.email` are unique
  - `follows(follower_id, following_id)` is unique (prevents duplicate follows)
  - `likes(user_id, post_id)` is unique (prevents duplicate likes)
- **Soft Deletes**: `is_deleted` flags for users, posts, and comments
- **Timestamps**: `created_at` and `updated_at` for all tables

## API Design Patterns

### Authentication Flow
1. User registers with username, email, password, full_name
2. Password is hashed using bcrypt
3. User logs in with username/password
4. JWT token is generated and returned
5. Token is used for subsequent authenticated requests

### Content Feed Algorithm
1. Get all users that the current user follows
2. Include current user's own posts
3. Query posts from these users
4. Order by creation date (newest first)
5. Add like/comment counts and user like status
6. Apply pagination

### Like System
- Users can like/unlike posts
- Each user can only like a post once (enforced by unique constraint)
- Like counts are calculated on-demand for performance
- Like status is checked per user per post

### Comment System
- Users can create, edit, delete their own comments
- Comments respect the post's `comments_enabled` setting
- Comment counts are calculated on-demand
- Comments are soft-deleted (marked as deleted, not physically removed)

## Performance Optimizations

### Database Indexes
```sql
-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_full_name ON users(full_name);

-- Post queries
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Follow relationships
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Likes and comments
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

### Query Optimization
- Use parameterized queries to prevent SQL injection
- Implement pagination for large result sets
- Use JOINs efficiently to minimize database round trips
- Cache frequently accessed data (can be implemented with Redis)

## Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt
- Input validation with Joi schemas
- User can only modify their own content

### Data Protection
- SQL injection prevention through parameterized queries
- Input sanitization and validation
- CORS configuration for cross-origin requests
- Helmet.js for security headers

### Error Handling
- Generic error messages in production
- Detailed error logging for debugging
- Proper HTTP status codes
- Input validation errors with detailed feedback

## Scalability Considerations

### Database Scaling
- Read replicas for read-heavy operations
- Connection pooling for database connections
- Query optimization and indexing
- Consider sharding for very large datasets

### Application Scaling
- Stateless application design
- Horizontal scaling with load balancers
- Caching layer (Redis) for frequently accessed data
- CDN for media files

### API Rate Limiting
- Implement rate limiting per user/IP
- Use Redis for rate limiting storage
- Different limits for different endpoints

## Testing Strategy

### Unit Tests
- Test individual functions and models
- Mock database connections
- Test validation schemas
- Test authentication middleware

### Integration Tests
- Test API endpoints end-to-end
- Test database operations
- Test authentication flows
- Test error scenarios

### Load Testing
- Test API performance under load
- Test database query performance
- Test concurrent user scenarios
- Monitor memory and CPU usage

## Deployment Checklist

### Environment Setup
- [ ] PostgreSQL database configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] SSL certificates configured (production)

### Security
- [ ] JWT secret is secure and unique
- [ ] Database credentials are secure
- [ ] CORS settings are appropriate
- [ ] Rate limiting is configured

### Monitoring
- [ ] Application logging is configured
- [ ] Database monitoring is set up
- [ ] Error tracking is implemented
- [ ] Performance monitoring is active

### Backup & Recovery
- [ ] Database backup strategy is in place
- [ ] Application deployment rollback plan
- [ ] Data recovery procedures documented
- [ ] Disaster recovery plan exists
