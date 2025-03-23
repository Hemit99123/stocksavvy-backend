import express from "express"
import { authenticateSession } from "../middleware/session.middleware";
import { bookmarkController } from "../controllers/bookmark.controller";

const router = express.Router()

router.get("/get", authenticateSession, bookmarkController.getUserBookmark)
router.post("/create", authenticateSession, bookmarkController.createBookmark)
router.delete("/delete", authenticateSession, bookmarkController.deleteBookmark)

export default router;