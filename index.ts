import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./src/utils/docs/swaggerConfig.ts";
import session from "express-session";
import { redisClient } from "./src/utils/auth/redis.ts";
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
import questionRoutes from "./src/routes/questions.route.ts"

// JSON middleware
app.use(express.json());

// CORS middleware
app.use(
  cors({
    // the endpoint at which requests are allowed, any other place we will block it
    // this adds an extra layer of security as no other endpoint can request resources from this api so no bad actors (black-hat hackers) can ever gain access
    origin: process.env.FRONTEND_URL as string,
    // credentials must be true so cookies can be sent to the frontend endpoint (for session based auth)
    credentials: true,
  }),
);

// Session middleware (config for session and its cookie)
app.use(
  session({
    name: "session-id",
    secret: process.env.SESSION_SECRET || "default_secret", // Make sure to set this in your environment
    store: new RedisStore({ client: redisClient }),
    genid: () => uuidv4(), // Use uuid to generate the session ID
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // So only a server is able to access the cookie within request headers (no JS scripts)
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
      sameSite: "none"
    },
  })
);

// Setup routing
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/forum", forumRoutes)
app.use("/question", questionRoutes)

// Route for api docs from Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start server
app.listen(PORT || process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app
