import type { Request, Response } from "express";
import { db } from "../utils/db/index.ts";
import user  from "../models/db/user.ts";
import { eq } from "drizzle-orm";
import { errorResponse, successResponse } from "../utils/response/index.ts";
import { handleCreateSession, handleDestroySession, handleGetSession } from "../utils/auth/sessions.ts";
import { redisClient, connectOTPRedis, disconnectOTPRedis } from "../utils/auth/redis.ts";
import { transporter } from "../utils/nodemailer/index.ts";
import { getHTMLTemplate } from "../utils/nodemailer/htmlTemplate.ts";

// This ensures a uniform keyname for all the times we access otp redis keys
const redisOTPKeyName = (email: string) => {
  return `otp:${email}`
}

const authController = {
  assignOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);

      const html = await getHTMLTemplate(random4DigitNumber)
      
      await connectOTPRedis();
      await redisClient.set(redisOTPKeyName(email), random4DigitNumber, {
        EX: 180000
      })

      const mailOptions = {
        to: email,
        subject: "Your OTP - StockSavvy",
        html,
      };

      // sending the email to the user
      await transporter.sendMail(mailOptions);  

      successResponse(res, "Sent email to user with OTP!")

    } catch (error) {
      errorResponse(res, error)
    } finally {
      await disconnectOTPRedis();
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, name, otp } = req.body;

      // this finds from the sql DB itself
      let userList = await db.select().from(user).where(eq(user.email, email)).execute();
      const userObj = userList[0]
      let role;

      await connectOTPRedis();
      const otpFromEmail = await redisClient.get(redisOTPKeyName(email))

      if (otpFromEmail == otp && user) {

        // If the user does not exist, create the user and return true
        if (!userObj) {
          await db.insert(user).values({ email: email, name: name, role: "User"});
          role = "User"
        } else {
          role = userObj.role
        }

        await handleCreateSession(name, email, role, res)

        // this deletes the otp right after its used (one-use)
        await redisClient.del(redisOTPKeyName(email))
        successResponse(res, "Sucessfully logged in")

      } else {
        throw new Error(
          otpFromEmail !== otp 
            ? "Invalid OTP" 
            : !user 
              ? "This email is in-use by the google provider" 
              : "An unexpected error occurred"
        );      
      }
    } catch (error) {
      errorResponse(res,error)
    } finally {
      await disconnectOTPRedis();
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      await handleDestroySession(req, res);

      successResponse(res, "Logged user out")

    } catch (error) {
      errorResponse(res, error);
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const session = await handleGetSession(req)
      await db.delete(user).where(eq(user.email, session.email)).execute();
      await handleDestroySession(req, res);

      successResponse(res, "Deleted user")

    } catch (error) {
      errorResponse(res, error);
    }
  },

  getInfoSession: async (req: Request, res: Response) => {
    try {
      const session = await handleGetSession(req)
      
      let auth;

      if (session.email && session.name && session.role) {
        auth = true
      } else {
        auth = false
      }
      
      res.json({session: session, auth})

    } catch (error) {
      errorResponse(res, error)
    }
  }
};

export default authController;
