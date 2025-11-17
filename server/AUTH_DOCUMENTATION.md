# Authentication System - Redis & JWT Implementation

## Overview
Your authentication system now uses Redis for refresh token storage and JWT for access/refresh tokens with enhanced security.

## Key Features
- **Dual Token System**: Short-lived access tokens (15m) + long-lived refresh tokens (7d)
- **Redis Storage**: Refresh tokens stored in Redis for fast invalidation
- **Secure Cookies**: httpOnly, sameSite strict, and production-ready secure flags
- **Protected Routes**: Middleware for authentication and admin-only routes

## Environment Variables Required

Add these to your `.env` file:

```env
# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key

# Redis (Upstash or local Redis)
UPSTASH_REDIS_URL=redis://localhost:6379  # or your Upstash URL

# Other
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

### 1. Signup
**POST** `/api/v1/auth/signup`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Cookies Set:**
- `accessToken` (15 minutes)
- `refreshToken` (7 days)

---

### 2. Login
**POST** `/api/v1/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Cookies Set:**
- `accessToken` (15 minutes)
- `refreshToken` (7 days)

---

### 3. Logout
**POST** `/api/v1/auth/logout`

**Headers:** Requires cookies

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Action:** Deletes refresh token from Redis and clears cookies

---

### 4. Refresh Token
**POST** `/api/v1/auth/refresh-token`

**Headers:** Requires `refreshToken` cookie

**Response:**
```json
{
  "message": "Token refreshed successfully"
}
```

**Action:** Issues new access token if refresh token is valid

---

### 5. Get Profile (Protected)
**GET** `/api/v1/auth/profile`

**Headers:** Requires `accessToken` cookie

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "cartItems": [],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## How It Works

### Token Flow
1. **Signup/Login**: User receives both access and refresh tokens as httpOnly cookies
2. **Access Token**: Used for API requests (short-lived, 15 minutes)
3. **Refresh Token**: Stored in Redis, used to get new access tokens (7 days)
4. **Token Refresh**: When access token expires, client calls `/refresh-token` to get a new one
5. **Logout**: Removes refresh token from Redis and clears cookies

### Security Features
- **httpOnly cookies**: Prevents XSS attacks
- **sameSite strict**: Prevents CSRF attacks
- **secure flag**: Enforced in production (HTTPS only)
- **Redis storage**: Allows instant token invalidation on logout
- **Bcrypt hashing**: Passwords hashed with pre-save hook (10 rounds)

## Middleware Usage

### Protect Routes (Authentication Required)
```javascript
import { protectRoute } from "../middleware/auth.middleware.js";

router.get("/protected", protectRoute, yourController);
```

### Admin Only Routes
```javascript
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

router.post("/admin-only", protectRoute, adminRoute, yourController);
```

## Redis Setup

### Option 1: Upstash (Recommended for Production)
1. Go to [Upstash](https://upstash.com/)
2. Create a Redis database
3. Copy the Redis URL
4. Add to `.env`: `UPSTASH_REDIS_URL=your_url_here`

### Option 2: Local Redis (Development)
1. Install Redis: `sudo apt install redis-server` (Linux)
2. Start Redis: `redis-server`
3. Add to `.env`: `UPSTASH_REDIS_URL=redis://localhost:6379`

## Files Changed/Added

### New Files:
- `/src/lib/redis.js` - Redis connection configuration
- `/src/middleware/auth.middleware.js` - Authentication middleware
- `/.env.example` - Environment variables template

### Modified Files:
- `/src/controller/auth.controller.js` - Complete rewrite with Redis
- `/src/routes/auth.route.js` - Added new endpoints
- `/src/server.js` - Added cookie-parser middleware

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"test123"}' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123"}' \
  -c cookies.txt
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -b cookies.txt
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh-token \
  -b cookies.txt \
  -c cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -b cookies.txt
```

## Next Steps

1. **Set up Redis**: Choose Upstash or local Redis
2. **Add environment variables**: Copy `.env.example` to `.env` and fill in values
3. **Generate JWT secrets**: Use `openssl rand -base64 64` for strong secrets
4. **Test endpoints**: Use the cURL commands above or Postman
5. **Frontend integration**: Update axios/fetch calls to include credentials

## Frontend Integration (React/Axios Example)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important: Send cookies with requests
});

// Login
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Get Profile
const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Refresh Token (call when access token expires)
const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  return response.data;
};

// Logout
const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
```

---

**Note**: Make sure to add Redis URL and JWT secrets to your `.env` file before testing!
