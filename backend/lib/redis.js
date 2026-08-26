import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL);

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("error", (err) => {
    console.error("Redis error:", err.message);
});

redis.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});

export default redis;