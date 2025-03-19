import express from "express";
import questionsController from "../controllers/questions.controller.ts";
import { authenticateAdminSession, authenticateSession } from "../middleware/session.middleware.ts";
const router = express.Router();

router.get("/get", authenticateSession, questionsController.getRandomQuestions)
router.post("/create", authenticateAdminSession, questionsController.createQuestion)

export default router;