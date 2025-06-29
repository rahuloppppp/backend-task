
-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- POSTS
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  media_url TEXT,
  comments_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- COMMENTS
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LIKES
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  UNIQUE(post_id, user_id)
);

-- FOLLOWERS
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id),
  following_id INTEGER REFERENCES users(id),
  UNIQUE(follower_id, following_id)
);
