import type { Response, Request } from "express";
import { Repository } from "redis-om";
import sessionsSchema from "../../redisSchema/sessions.schema.ts"
import { redisOMClient } from "./redis.ts";
import { v4 as uuidv4 } from 'uuid';

export const handleDestroySession = async (req: Request, res: Response) => {
  const sid = req.cookies["session-id"]
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);
  
  await sessionRepo.remove(sid)

  res.clearCookie("session-id")
}

export const handleCreateSession = async (name: string, email: string, role: string, res: Response) => {
  const sid = uuidv4()
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);

  const sessionData = {
    name,
    email,
    role
  }

  await sessionRepo.save(sid, sessionData);

  res.cookie('session-id', sid, { httpOnly: true}); 

}

export const handleGetSession = async (req: Request) => {
  const sid = req.cookies["session-id"]
  const sessionRepo = new Repository(sessionsSchema, redisOMClient);

  const session = await sessionRepo.fetch(sid)

  return session
}