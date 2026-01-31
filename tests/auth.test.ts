import request from "supertest";
import { Express } from "express";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup";
import { createApp } from "../src/app";

describe("Auth API", () => {
  let app: Express;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp(); // You'll need to export createApp from your app.ts
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 for invalid data", async () => {
      const userData = {
        name: "T",
        email: "invalid-email",
        password: "123",
        confirmPassword: "123",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 400 if passwords do not match", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "DifferentPassword",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Passwords do not match");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Create a test user first
      await request(app).post("/api/v1/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });
    });

    it("should login with valid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should return 401 with invalid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "WrongPassword",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid credentials");
    });
  });
});
