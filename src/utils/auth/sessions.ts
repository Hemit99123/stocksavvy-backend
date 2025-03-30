import type { Request, Response } from "express";
import { successResponse } from "../response/index.ts";

export const handleDestroySession = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed", error: err.message });
        
        // clear the session id cookie on the frontend
        res.clearCookie('session-id', { path: '/' });
        return successResponse(res, "Logged out successfully")
  
      });
}