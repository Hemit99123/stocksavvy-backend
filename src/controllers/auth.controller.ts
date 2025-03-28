import type { Request, Response } from "express";
import { db } from "../utils/db/index.ts";
import user  from "../models/user.ts";
import { eq } from "drizzle-orm";
import handleError from "../utils/error/handleError.ts";
import { handleDestroySession } from "../utils/auth/sessions.ts";
import { findUserOrAdd } from "../utils/auth/findUser.ts";
import { redisClient } from "../utils/auth/redis.ts";
import { transporter } from "../utils/nodemailer/index.ts";

// This ensures a uniform keyname for all the times we access otp redis keys
const redisKeyName = (email: string) => {
  return `otp:${email}`
}

const authController = {
  assignOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);

      await redisClient.set(redisKeyName(email), random4DigitNumber, 'EX', 180)

      const mailOptions = {
        to: email,
        subject: "Your OTP - StockSavvy",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
              }
              .header h1 {
                margin: 0;
                color: #286A4D; /* Updated color */
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #286A4D; /* Updated color */
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                font-size: 14px;
                color: #666;
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>StockSavvy</h1>
              </div>
              <p>Hello,</p>
              <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
              <div class="otp">${random4DigitNumber}</div>
              <p>This OTP is only valid for 3 minutes.</p>
              <div class="footer">
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      // sending the email to the user
      await transporter.sendMail(mailOptions);  

      res.json({
        message: "Sent email to user with OTP!"
      })
    } catch (error) {
      handleError(res, error)
    }
  },

  loginEmail: async (req: Request, res: Response) => {
    try {
      const { email, name, otp } = req.body;

      const continueLogin = await findUserOrAdd(email, name, "email")

      const otpFromEmail = await redisClient.get(redisKeyName(email))

      if (otpFromEmail == otp && continueLogin) {
        // assign the session
        req.session.user = {email}

        // this deletes the otp right after its used (one-use)
        redisClient.del(redisKeyName(email))
        res.json({ message: "Successfully logged in", name});
      } else {
        throw new Error(
          otpFromEmail !== otp 
            ? "Invalid OTP" 
            : !continueLogin 
              ? "This email is in-use by the google provider" 
              : "An unexpected error occurred"
        );      
      }
    } catch (error) {
      handleError(res,error)
    }
  },

  logout: (req: Request, res: Response) => {
    try {
      if (!req.session?.user) {
        return res.status(400).json({ message: "Not logged in", error: "not-authenticated" });
      }
      handleDestroySession(req, res);
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { email } = req.session.user ?? {};
      if (!email) {
        return res.status(400).json({ message: "No user in session", error: "not-authenticated" });
      }
      await db.delete(user).where(eq(user.email, email)).execute();
      handleDestroySession(req, res);
    } catch (error) {
      handleError(res, error);
    }
  },

  getInfoSession: (req: Request, res: Response) => {
    try {
      const auth = req.session.user ? true : false;
      res.json({session: req.session.user, auth: auth})
    } catch (error) {
      handleError(res, error)
    }
  }
};

export default authController;
