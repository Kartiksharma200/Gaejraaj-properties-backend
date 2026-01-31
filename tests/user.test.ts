import request from "supertest";
import { Express } from "express";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup";
import { createApp } from "../src/app";

describe("User API", () => {
  let app: Express;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Register and login a test user
    await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    });

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "Password123",
    });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe("GET /api/v1/users/profile", () => {
    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("email", "test@example.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .get("/api/v1/users/profile")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Not authorized");
    });
  });

  describe("PUT /api/v1/users/profile", () => {
    it("should update user profile", async () => {
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await request(app)
        .put("/api/v1/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Profile updated successfully");
      expect(response.body.data).toMatchObject(updateData);
    });

    it("should return 400 for invalid email", async () => {
      const updateData = {
        email: "invalid-email",
      };

      const response = await request(app)
        .put("/api/v1/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/users", () => {
    it("should get all users", async () => {
      // Create another user
      await request(app).post("/api/v1/auth/register").send({
        name: "Another User",
        email: "another@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });

      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body).toHaveProperty("count", 2);
    });

    it("should paginate users", async () => {
      // Create multiple users
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post("/api/v1/auth/register")
          .send({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            password: "Password123",
            confirmPassword: "Password123",
          });
      }

      const response = await request(app)
        .get("/api/v1/users?page=2&limit=5")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body).toHaveProperty("pages");
      expect(response.body).toHaveProperty("total");
    });
  });
});
