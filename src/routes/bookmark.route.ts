import express from "express"
import { authenticateSession } from "../middleware/session.middleware.ts";
import { bookmarkController } from "../controllers/bookmark.controller.ts";

const router = express.Router()

router.get("/get", authenticateSession, bookmarkController.getUserBookmark)
router.post("/create", authenticateSession, bookmarkController.createBookmark)
router.delete("/delete", authenticateSession, bookmarkController.deleteBookmark)

export default router;