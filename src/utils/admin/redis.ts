import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisAdminClient = new Redis(process.env.REDIS_ENDPOINT as string);
