import type { Request, Response } from "express";
import handleError from "../utils/error/handleError.ts";
import { bookmark, comment, forum } from "../models/schema.ts";
import { db } from "../utils/db/index.ts";
import { eq, and } from "drizzle-orm";

export const bookmarkController = {
    createBookmark: async (req: Request, res: Response) => {
        const {id} = req.query;
        const email = req.session.user.email;

        try {
            await db
                .insert(bookmark)
                .values({
                    email,
                    forumID: Number(id)
            })
            
            res.status(200).json({
                message: "Created a bookmark"
            })
        } catch(error) {
            handleError(error, res)
        }
    },
    
    deleteBookmark: async (req: Request, res: Response) => {
        const {id} = req.query;
        const email = req.session.user.email;

        try {
            await db
                .delete(bookmark)
                .where(and(eq(bookmark.id, Number(id)), eq(bookmark.email, email)))
            
            res.status(200).json({
                message: "Deleted a bookmark"
            })
        } catch(error) {
            handleError(error, res)
        }
    } 
}