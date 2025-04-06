import { Redis } from "ioredis";
import dotenv from "dotenv";
import { createClient } from "redis"

dotenv.config();

export const redisClient = new Redis(process.env.REDIS_ENDPOINT as string);
export const redisOMClient = createClient({
    url: process.env.REDIS_ENDPOINT
})