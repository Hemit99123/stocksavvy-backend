import type { Request, Response } from "express";
import handleError from "../utils/error/handleError.ts";
import { bookmark } from "../models/schema.ts";
import { db } from "../utils/db/index.ts";
import { eq, and } from "drizzle-orm";

export const bookmarkController = {
    createBookmark: async (req: Request, res: Response) => {
        const {forumID} = req.query;
        const email = req.session.user.email;

        try {
            const existingBookmark = await db
                .select()
                .from(bookmark)
                .where(and(eq(bookmark.forumID, Number(forumID)), eq(bookmark.email, email)))
            
            // do not let user create another bookmark if one already exists of the forumid
            if (existingBookmark) {
                throw new Error("Bookmark already exists")
            } 

            await db
                .insert(bookmark)
                .values({
                    email,
                    forumID: Number(forumID)
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
    },

    getUserBookmark: async (req: Request, res: Response) => {
        const email = req.session.user.email;

        try {
            const userBookmark = await db
                .select()
                .from(bookmark)
                .where(eq(bookmark.email,email))

            res.status(200).json({
                bookmark: userBookmark,
                message: "Retrieved all bookmarks for your user"
            })
        } catch(error) {
            handleError(error, res)
        }
    }
}