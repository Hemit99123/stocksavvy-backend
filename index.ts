import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./src/utils/docs/swaggerConfig.ts";
import session, { SessionData } from "express-session";
import { redisClient, redisOMClient } from "./src/utils/auth/redis.ts";
import cors from "cors";
import { RedisStore } from "connect-redis";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

// Server configuration
const PORT = 3001;
const app = express();

// Routers
import indexRoutes from "./src/routes/index.route.ts";
import authRoutes from "./src/routes/auth.route.ts";
import forumRoutes from "./src/routes/forum.route.ts";
import questionRoutes from "./src/routes/questions.route.ts";
import adminRoutes from "./src/routes/admin.route.ts";

// JSON middleware
app.use(express.json());

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
  })
);

app.set("trust proxy", 1);

import sessionsSchema from "./src/redisSchema/sessions.schema.ts";
import { Repository } from "redis-om";

// Extend SessionData interface to include your custom properties
declare module "express-session" {
  interface SessionData {
    cookie: session.Cookie;
    userId?: string;
    // Add any other custom session properties you need
  }
}

// Custom Redis-OM Session Store
class CustomRedisOMStore extends session.Store {
  private sessionRepo: Repository;

  constructor() {
    super();
    this.sessionRepo = new Repository(sessionsSchema, redisOMClient);
  }

  async connect() {
    if (!redisOMClient.isOpen) {
      await redisOMClient.connect();
    }
  }

  async get(sid: string, callback: (err: any, session?: SessionData | null) => void) {
    try {
      await this.connect();
      const session = await this.sessionRepo.fetch(sid);
      callback(null, session as SessionData || null);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, session: SessionData, callback?: (err?: any) => void) {
    try {
      await this.connect();
      // Ensure cookie is properly saved with the session
      const sessionData = {
        ...session,
        cookie: session.cookie,
      };
      await this.sessionRepo.save(sid, sessionData);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await this.connect();
      await this.sessionRepo.remove(sid);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async touch(sid: string, session: SessionData, callback?: (err?: any) => void) {
    try {
      await this.connect();
      await this.sessionRepo.expire(sid, session.cookie.maxAge / 1000);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}

// Session middleware with custom Redis-OM store
app.use(
  session({
    name: "session-id",
    secret: process.env.SESSION_SECRET || "default_secret",
    store: new CustomRedisOMStore(),
    genid: () => uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.DOMAIN
    },
  })
);

// Setup routing
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/forum", forumRoutes);
app.use("/question", questionRoutes);
app.use("/admin", adminRoutes);

// Route for api docs from Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start server
app.listen(PORT || process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;