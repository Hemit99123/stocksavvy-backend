import express from "express";
import questionsController from "../controllers/questions.controller.ts";
import { authenticateSession } from "../middleware/session.middleware.ts";
const router = express.Router();

router.get("/get", authenticateSession, questionsController.getRandomQuestions)
router.get("/get-all", authenticateSession, questionsController.getAllQuestions)

export default router;