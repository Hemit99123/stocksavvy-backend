import type { NextFunction, Request, Response } from "express";

export const authenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // using express sessions for session management (instead of pure passportjs)
  // only using passportjs for the authentication middleware

  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({
      message:
        "You are currently not authenticated! Please log in and try again.",
    });
  }
};

export const authenticateAdminSession = (
  req: Request,
  res: Response, 
  next: NextFunction,
) => {
  if (req.session.user && req.session.user.role === "Admin") {
    next();
  } else {
    return res.status(401).json({
      message:
        "You are currently not authenticated! Please log in and try again.",
    });
  }
}