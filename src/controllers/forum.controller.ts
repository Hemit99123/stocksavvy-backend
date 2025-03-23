import type { Request, Response } from "express";
import handleError from "../utils/error/handleError.ts";
import { comment, forum } from "../models/schema.ts";
import { db } from "../utils/db/index.ts";
import { eq, and } from "drizzle-orm";

export const forumController = {
    createQuestion: async (req: Request, res: Response) => {
        const { question, content } = req.body;
        const email = req.session.user?.email;

        if (!question || !email) {
            return res.status(400).json({
                message: "Question and email are required",
            });
        }

        try {
            // create a document
            await db
                .insert(forum)
                .values({
                    question,
                    email,
                    content
                });

            res.status(201).json({
                message: "Forum question created successfully",
            });
        } catch (error: unknown) {
            handleError(res,error)
        }
    },

    deleteQuestion: async (req: Request, res: Response) => {
        const { id } = req.body;
        const email = req.session.user?.email;

        try {

            // delete all associated comments 
            await db.delete(comment).where(eq(comment.forumID, id));

            // delete a document 
            await db
                .delete(forum)
                // Match by both email and id, this way only the owner can delete a question
                .where(and(eq(forum.email, email as string),eq(forum.id, id))); 
            
            res.status(200).json({
                message: "Deleted your document successfully"
            })
            
        } catch(error) {
            handleError(res,error)
        }
    },

    updateQuestion: async (req: Request, res: Response) => {
        const { id, question, content } = req.body;
        const email = req.session.user?.email;
    
        try {
            await db.update(forum)
                .set({ content,question })
                .where(and(eq(forum.id, id), eq(forum.email, email)));
            
            res.status(200).json({
                message: "Updated forum"
            })
        } catch (error: unknown) {
            handleError(res, error);
        }
    },
    

    getAllQuestions: async (req: Request, res: Response) => {
        try {
            const questions = await db 
                .select()
                .from(forum)
            
            res.status(200).json({
                questions
            })

        } catch(error: unknown) {
            handleError(res,error)
        }
    },

    getAllUserQuestions: async (req: Request, res: Response) => {
        const email = req.session.user.email;

        try {
            const questions = await db
                .select()
                .from(forum)
                .where(eq(forum.email, email as string))
            
            res.status(200).json({
                questions,
                message: "Got all questions for user"
            })
        } catch(error) {
            handleError(res,error)
        }
    },
    getOnePost: async (req: Request, res: Response) => {
        const { id } = req.query;

        try {
            const questions = await db
                .select()
                .from(forum)
                .where(eq(forum.id, Number(id)))
            
            res.status(200).json({
                question: questions[0],
                message: "Got question based off id"
            })
                
        } catch(error) {
            handleError(res, error)
        }
    }
};

export const forumCommentController = {
    createComment: async (req: Request, res: Response) => {
        const { forumID, content } = req.body;
        const email = req.session.user?.email;

        try {
            await db
                .insert(comment)
                .values({
                    forumID,
                    content,
                    email
                })
            
            res.status(200).json({
                message: "Successfully sent"
            })
        } catch(error) {
            handleError(res, error)
        }
    },


    deleteQuestion: async (req: Request, res: Response) => {
        const { id } = req.body;
        const email = req.session.user?.email;
    
        try {
            // Delete comment where id matches and belongs to the user
            await db
                .delete(comment)
                .where(and(eq(comment.email, email), eq(comment.id, id))); 
            
            res.status(200).json({
                message: "Deleted your comment successfully"
            });
            
        } catch (error) {
            handleError(res, error);
        }
    },

    getForumComments: async (req: Request, res: Response) => {
        const { id } = req.query;

        try {
            const comments = await db 
                .select()
                .from(comment)
                .where(eq(comment.forumID, Number(id)))
            
            res.status(200).json({
                comments
            })

        } catch(error: unknown) {
            handleError(res,error)
        }
    },
}