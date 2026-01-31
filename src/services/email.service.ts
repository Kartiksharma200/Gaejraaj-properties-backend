import nodemailer from "nodemailer";
import { config } from "../config/env";

export class EmailService {
  private static transporter: any;

  static initialize() {
    if (
      !this.transporter &&
      config.smtp.host &&
      config.smtp.user &&
      config.smtp.pass
    ) {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port || 587,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(to: string, name: string): Promise<void> {
    if (!this.transporter) {
      this.initialize();
    }

    if (!this.transporter) {
      console.log("Email service not configured");
      return;
    }

    const mailOptions = {
      from: `"Your App" <${config.smtp.user}>`,
      to,
      subject: "Welcome to Our App!",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining our application.</p>
        <p>We're excited to have you on board!</p>
        <br/>
        <p>Best regards,</p>
        <p>The Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${to}`);
    } catch (error: any) {
      console.error("Failed to send welcome email:", error);
      throw new Error("Failed to send email");
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(
    to: string,
    resetToken: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.initialize();
    }

    if (!this.transporter) {
      console.log("Email service not configured");
      return;
    }

    const resetUrl = `http://localhost:5000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Your App" <${config.smtp.user}>`,
      to,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <br/>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${to}`);
    } catch (error: any) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send email");
    }
  }
}
