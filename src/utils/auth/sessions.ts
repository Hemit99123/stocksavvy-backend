import type { Response, Request } from "express";
import { Repository } from "redis-om";
import sessionsSchema from "../../redisSchema/sessions.schema.ts"
import { redisOMClient } from "./redis.ts";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"

dotenv.config()

export const handleDestroySession = async (req: Request, res: Response) => {

  redisOMClient.connect()

  const sid = req.cookies["session-id"]
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);
  
  await sessionRepo.remove(sid)

  res.clearCookie("session-id")

  redisOMClient.disconnect()

}

export const handleCreateSession = async (name: string, email: string, role: string, res: Response) => {

  redisOMClient.connect()

  const sid = uuidv4()
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);

  const sessionData = {
    name,
    email,
    role
  }

  await sessionRepo.save(sid, sessionData);

  res.cookie('session-id', sid, { httpOnly: true, domain: process.env.DOMAIN}); 

  redisOMClient.disconnect()
}

export const handleGetSession = async (req: Request) => {

  redisOMClient.connect()

  const sid = req.cookies["session-id"]
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);

  const session = await sessionRepo.fetch(sid)

  redisOMClient.disconnect()

  return session
}