import dotenv from "dotenv";
dotenv.config();

const envConfig = {
    FRONTEND: process.env.FRONTEND || process.env.FRONT_END,
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || process.env.JWT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN, 
    GOOGLE_APP_GMAIL: process.env.GOOGLE_APP_GMAIL || process.env.EMAIL_USER,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD || process.env.EMAIL_PASS,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL
}

export default envConfig;