import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import db from "../utils/dbconfig.js";

export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, dateOfBirth, gender, phone } =
    req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender || !phone) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  // Date validation
  const isValidDate = !isNaN(Date.parse(dateOfBirth));
  if (!isValidDate) {
    return next(errorHandler(400, "Invalid date format for date of birth."));
  }

  try {
    // 1. First check if email already exists
    const [emailCheck] = await db.execute(
      "SELECT email FROM customers WHERE email = ?",
      [email]
    );

    if (emailCheck.length > 0) {
      return next(errorHandler(400, "Email already exists. Please use a different email."));
    }

    // 2. Get the highest existing member ID
    const [rows] = await db.execute(
      "SELECT member_id FROM customers ORDER BY member_id DESC LIMIT 1"
    );

    let nextMemberId = "VM002193"; // Default starting point if no users exist

    if (rows.length > 0) {
      const lastMemberId = rows[0].member_id;
      // Extract the numeric part and increment
      const numericPart = parseInt(lastMemberId.replace("VM", ""));
      nextMemberId = `VM${String(numericPart + 1).padStart(6, '0')}`;
    }

    // Calculate age
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    
    // Validate age (example: must be at least 18 years old)
    if (age < 18) {
      return next(errorHandler(400, "You must be at least 18 years old to register"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentTimestamp = new Date();

    // 3. Insert the new user
    const [result] = await db.execute(
      `INSERT INTO customers 
       (member_id, first_name, last_name, email, password, d_o_b, age, gender, contact_no, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextMemberId,
        firstName,
        lastName,
        email,
        hashedPassword,
        dateOfBirth,
        age,
        gender,
        phone,
        currentTimestamp
      ]
    );

    res.status(201).json({ 
      success: true,
      message: "User registered successfully!",
      memberId: nextMemberId 
    });
    
  } catch (error) {
    console.error("Registration Error:", error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return next(errorHandler(400, "Email already exists. Please use a different email."));
    }
    
    // Handle other potential errors
    next(errorHandler(500, "Registration failed. Please try again later."));
  }
};
export const signin = async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Determine which table to query based on isAdmin flag
    // For staff signin, we also need to check the users table
    const table = isAdmin ? 'users' : 'customers';
    
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // For admin/staff signin, verify user type
    if (isAdmin) {
      // Allow both admin (user_type_id = 1) and staff (user_type_id = 2)
      // Adjust these IDs based on your actual user type system
      if (user.user_type_id !== 1 && user.user_type_id !== 3) {
        return res.status(403).json({ message: "Admin/Staff access denied! Invalid user type." });
      }
    }

    // Create token with appropriate payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      isAdmin: isAdmin ? true : false,
      userType: user.user_type_id // Include user type for frontend differentiation
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...otherDetails } = user;

    // Set expiry date to 1 hour from current time
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res
      .cookie("access_token", token, { 
        httpOnly: true, 
        expires: expiryDate,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .status(200)
      .json({ 
        user: otherDetails, 
        token,
        isAdmin: isAdmin ? true : false,
        userType: user.user_type_id
      });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};