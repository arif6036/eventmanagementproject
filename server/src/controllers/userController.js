const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../config/emailService");
const { loginTemplate } = require("../config/emailTemplates");

require('dotenv').config()

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const isFirstUser = (await User.countDocuments()) === 0;
      const assignedRole = isFirstUser ? "admin" : role || "user";
  
      // ✅ Create user as unverified
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
        verified: false, // ✅
      });
  
      // ✅ Generate email verification token (expires in 24h)
      const verifyToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

  
      // ✅ Send email
      await sendEmail(
        user.email,
        "Verify your EventEase account",
        `
          <h3>Hi ${user.name},</h3>
          <p>Thank you for registering. Please verify your email by clicking the link below:</p>
          <a href="${verifyLink}" style="background: #198754; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Verify Email
          </a>
          <p>This link will expire in 24 hours.</p>
        `
      );
  
      // ✅ Send response to frontend
      res.status(201).json({
        message: "Registration successful! Please check your email to verify your account.",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
      await sendEmail(user.email, "Login Alert - EventEase", loginTemplate(user.name));
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(1), // Expire the cookie immediately
    });

    res.json({ message: "Logged out successfully" });
};


const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields (only if provided)
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.darkMode !== undefined) user.darkMode = req.body.darkMode;

        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      // ✅ Strong password validation
      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
  
      if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter and one number",
        });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      // ✅ Generate login token
      const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      // ✅ Send success response with user + token
      res.json({
        message: "Password has been reset successfully.",
        token: newToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Reset Error:", error.message);
      res.status(400).json({
        message: "Invalid or expired token",
        error: error.message,
      });
    }
  };
  


// Forgot Password Function
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Forgot Password Function
const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate Reset Token (expires in 1 hour)
      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Frontend reset page URL
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  
      // ✅ Send reset email using utility
      await sendEmail(
        user.email,
        "Password Reset Request",
        `
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetLink}" style="background: #198754; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        `
      );
  
      res.json({ message: "Password reset email sent. Please check your inbox." });
  
    } catch (error) {
      console.error("❌ Forgot Password Error:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords for security
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent Admins from Deleting Themselves
        if (req.user.id === user.id) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        await user.deleteOne();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// ✅ Delete All Users (Admin Only)
const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).json({ message: "All users have been deleted", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Your account has been deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    updateUserProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    deleteAllUsers,
    deleteAccount,
    generateToken,
};
