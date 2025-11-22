# OTP Email Verification System

## Overview
A complete email-based OTP (One-Time Password) verification system has been implemented for user registration with the following features:

### Features
✅ **6-digit OTP** - Randomly generated using `crypto.randomInt()`  
✅ **15-minute expiry** - OTPs expire after 15 minutes for security  
✅ **Email delivery** - OTPs sent via configured Nodemailer  
✅ **Resend functionality** - Users can request new OTP after expiry  
✅ **Auto cleanup** - Unverified accounts deleted after 2 days  
✅ **Toast notifications** - Modern UI feedback using react-toastify  

## Backend Implementation

### 1. Database Schema (`/server/src/models/User.model.js`)
```javascript
{
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    otpExpires: { type: Date }
}
```

### 2. OTP Utilities (`/server/src/utils/otp.js`)
- `generateOTP()` - Generates random 6-digit code
- `getOTPExpiry()` - Returns Date 15 minutes from now

### 3. Auth Controller (`/server/src/controller/auth.controller.js`)
#### Modified Endpoints:
- **POST `/api/v1/auth/signup`**
  - Creates unverified user with hashed password
  - Generates and stores OTP with expiry
  - Sends OTP via email
  - Returns success without creating session

#### New Endpoints:
- **POST `/api/v1/auth/verify-otp`**
  - Validates email and OTP
  - Checks expiry time
  - Sets `isVerified: true`
  - Generates JWT tokens
  - Creates session cookies

- **POST `/api/v1/auth/resend-otp`**
  - Validates user exists and is unverified
  - Generates new OTP
  - Updates expiry time
  - Sends new OTP email

### 4. Email Template (`/server/src/Email/otpEmailTemplate.js`)
Professional HTML email with:
- Brand logo and colors
- 6-digit OTP prominently displayed
- Expiry warning (15 minutes)
- Security note
- Responsive design

### 5. Cleanup Job (`/server/src/jobs/cleanupUnverified.js`)
- Runs daily at midnight via node-cron
- Deletes users where:
  - `isVerified === false`
  - `createdAt < 2 days ago`
- Logs deletion count

### 6. Routes (`/server/src/routes/auth.route.js`)
```javascript
POST /api/v1/auth/signup        // Send OTP
POST /api/v1/auth/verify-otp    // Verify OTP and create session
POST /api/v1/auth/resend-otp    // Resend new OTP
```

## Frontend Implementation

### Register Component (`/client/src/components/Register.jsx`)

#### State Management:
```javascript
const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
const [canResend, setCanResend] = useState(false);
```

#### Flow:
1. **Registration Form** - User fills name, email, password
2. **OTP Sent** - Backend sends OTP to email
3. **Verification Form** - Shows:
   - 6-digit OTP input (numeric only, auto-limited)
   - Countdown timer (turns red < 1 minute)
   - Verify button (disabled if OTP !== 6 digits)
   - Resend button (enabled after expiry)
4. **Success** - Auto-login and redirect to home

#### Features:
- **Live Timer** - Counts down from 15:00 to 0:00
- **Auto-format** - OTP input accepts only digits, max 6
- **Visual Feedback** - Timer turns red when < 60 seconds
- **Toast Notifications** - All errors/success use react-toastify
- **Disabled States** - Buttons disable during loading

## User Flow

### Registration Flow:
```
User submits form
    ↓
Backend generates OTP
    ↓
OTP sent to email
    ↓
User enters OTP
    ↓
Backend validates OTP & expiry
    ↓
Account verified → Session created
    ↓
User logged in and redirected
```

### Resend Flow:
```
OTP expires (15 minutes)
    ↓
"Resend OTP" button enabled
    ↓
User clicks resend
    ↓
New OTP generated & sent
    ↓
Timer resets to 15:00
```

### Cleanup Flow:
```
Cron job runs daily at midnight
    ↓
Finds users: isVerified=false && createdAt < 2 days
    ↓
Deletes unverified accounts
    ↓
Logs count to console
```

## Security Features

1. **OTP Expiry** - 15-minute validity window
2. **Hashed Passwords** - Bcrypt hashing before storage
3. **Cleanup Job** - Removes abandoned registrations
4. **httpOnly Cookies** - XSS protection
5. **sameSite: lax** - CSRF protection
6. **Single-use OTP** - Cleared after verification

## Testing

### Manual Testing Steps:
1. **Register New User**
   ```
   POST http://localhost:8000/api/v1/auth/signup
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - ✅ User created with isVerified=false
   - ✅ OTP sent to email
   - ✅ otpExpires set to +15 minutes

2. **Verify OTP**
   ```
   POST http://localhost:8000/api/v1/auth/verify-otp
   {
     "email": "test@example.com",
     "otp": "123456"
   }
   ```
   - ✅ OTP validated
   - ✅ isVerified set to true
   - ✅ Cookies set with tokens
   - ✅ verificationOTP cleared

3. **Resend OTP**
   ```
   POST http://localhost:8000/api/v1/auth/resend-otp
   {
     "email": "test@example.com"
   }
   ```
   - ✅ New OTP generated
   - ✅ New expiry time set
   - ✅ New email sent

4. **Cleanup Job**
   - Wait 2 days or manually set createdAt to 3 days ago
   - Run server
   - Check console for cleanup log at midnight

## Dependencies

### Backend:
- `bcryptjs` - Password hashing
- `crypto` (Node.js built-in) - OTP generation
- `nodemailer` - Email sending
- `node-cron` - Scheduled cleanup job
- `jsonwebtoken` - JWT token generation

### Frontend:
- `react-toastify` - Toast notifications
- `lucide-react` - KeyRound icon
- `axios` - API requests

## Environment Variables
Ensure these are set in `/server/.env`:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# MongoDB
MONGO_URI=your-mongodb-uri

# Server
PORT=8000
NODE_ENV=development
```

## Files Modified/Created

### Backend:
- ✅ `/server/src/models/User.model.js` - Added verification fields
- ✅ `/server/src/utils/otp.js` - NEW: OTP utilities
- ✅ `/server/src/controller/auth.controller.js` - Modified signup, added verify/resend
- ✅ `/server/src/Email/otpEmailTemplate.js` - NEW: OTP email template
- ✅ `/server/src/jobs/cleanupUnverified.js` - NEW: Cleanup cron job
- ✅ `/server/src/server.js` - Initialize cleanup job
- ✅ `/server/package.json` - Added node-cron dependency

### Frontend:
- ✅ `/client/src/components/Register.jsx` - Complete OTP flow UI

## Future Enhancements

### Possible Improvements:
1. **Rate Limiting** - Limit OTP requests per email/IP
2. **SMS OTP** - Alternative to email via Twilio/AWS SNS
3. **2FA** - Optional two-factor authentication post-login
4. **OTP Attempts** - Limit failed verification attempts
5. **Email Templates** - More branded email designs
6. **Analytics** - Track OTP success/failure rates
7. **Localization** - Multi-language support

## Troubleshooting

### OTP Email Not Received:
1. Check spam/junk folder
2. Verify EMAIL_USER and EMAIL_PASS in .env
3. Enable "Less secure app access" for Gmail (or use App Password)
4. Check server logs for email sending errors

### OTP Already Expired:
1. Check server timezone matches expected timezone
2. Verify getOTPExpiry() is correctly adding 15 minutes
3. Request new OTP using resend functionality

### Cleanup Job Not Running:
1. Verify node-cron is installed: `npm list node-cron`
2. Check server logs for "Cleanup job scheduled" message
3. Verify cron expression: `'0 0 * * *'` (midnight daily)
4. Manually trigger by creating old test users

---

**Implementation Date:** [Current Date]  
**Status:** ✅ Complete and Functional  
**Version:** 1.0.0
