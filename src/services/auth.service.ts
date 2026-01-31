import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { config } from "../config/env";

export class AuthService {
  // Register new user
  static async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user.id, user.email);

      // Remove password from response
      const userResponse = user.toObject();
      delete (userResponse as any).password;

      return { user: userResponse, token };
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user
  static async login(
    email: string,
    password: string,
  ): Promise<{ user: any; token: string }> {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = this.generateToken(user.id, user.email);

      // Remove password from response
      const userResponse = user.toObject();
      delete (userResponse as any).password;

      return { user: userResponse, token };
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Generate JWT token
  static generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }

  // Verify token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Change password
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return true;
    } catch (error: any) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }
}
