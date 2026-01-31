import { User, IUser } from "../models/user.model";

export class UserService {
  // Create new user
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).select("-password");
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  // Get all users
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: IUser[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().select("-password").skip(skip).limit(limit),
        User.countDocuments(),
      ]);

      return {
        users,
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Update user
  static async updateUser(
    id: string,
    updateData: Partial<{ name: string; email: string }>,
  ): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
      ).select("-password");
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
