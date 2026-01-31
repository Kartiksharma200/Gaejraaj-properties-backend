import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { config } from "./config/env";
import { errorHandler, AppError } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { connectDB } from "./config/database";
import { logger } from "./utils/logger";
import apiRoutes from "./routes";

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;

    console.log(`🔧 App configured to use port: ${this.port}`);
    console.log(`🔧 NODE_ENV: ${config.nodeEnv}`);

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeDatabase(): void {
    connectDB();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.corsOrigin,
        credentials: true,
      })
    );

    // Basic sanitization
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.body) {
        for (const key in req.body) {
          if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].replace(/[<>]/g, "");
          }
        }
      }
      next();
    });

    // Mongo sanitize
    this.app.use(mongoSanitize());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests from this IP, please try again later.",
    });
    this.app.use("/api", limiter);

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(cookieParser());

    // Compression
    this.app.use(compression());

    // Logging
    if (config.nodeEnv === "development") {
      this.app.use(morgan("dev"));
    }

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Welcome route
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        message: "Welcome to the Backend API",
        version: "1.0.0",
        documentation: "/api-docs",
        health: "/health"
      });
    });

    // API routes
    this.app.use("/api/v1", apiRoutes);

    // Serve static files in production
    if (config.nodeEnv === "production") {
      this.app.use(express.static("public"));
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public listen() {
    console.log(`🎯 Attempting to start server on port: ${this.port}`);
    
    try {
      const server = this.app.listen(this.port, () => {
        logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${this.port}`);
        console.log(`✅ Server successfully started on port ${this.port}`);
        console.log(`📍 Local: http://localhost:${this.port}`);
        console.log(`📍 Health: http://localhost:${this.port}/health`);
        console.log(`📍 API: http://localhost:${this.port}/api/v1`);
      });

      // Handle server errors
      server.on('error', (error: NodeJS.ErrnoException) => {
        console.error(`❌ Failed to start server on port ${this.port}:`, error.message);
        if (error.code === 'EADDRINUSE') {
          console.log(`💡 Port ${this.port} is already in use by another process.`);
          console.log(`💡 Try these solutions:`);
          console.log(`   1. Change PORT in your .env file to ${this.port + 1}`);
          console.log(`   2. Kill the process: kill -9 $(lsof -t -i:${this.port})`);
          console.log(`   3. Wait 10 seconds and try again`);
        }
        process.exit(1);
      });

      return server;
    } catch (error: any) {
      console.error(`❌ Critical error starting server:`, error.message);
      process.exit(1);
    }
  }
}

export default App;