import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import db from "../utils/dbconfig.js";

export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, dateOfBirth, gender, phone } =
    req.body;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(
        400,
        "Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+)."
      )
    );
  }

  const isValidDate = !isNaN(Date.parse(dateOfBirth));
  if (!isValidDate) {
    return next(errorHandler(400, "Invalid date format for date of birth."));
  }

  const memberId = `SM-${Math.floor(Math.random() * 10000)}`;
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [result] = await db.execute(
      `INSERT INTO customers (member_id, first_name, last_name, email, password, d_o_b, age, gender, contact_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        firstName,
        lastName,
        email,
        hashedPassword,
        dateOfBirth,
        age,
        gender,
        phone,
      ]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const signin = async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Determine which table to query based on isAdmin flag
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

    // For admin signin, verify admin status
    if (isAdmin && user.user_type_id !== 1) {
      return res.status(403).json({ message: "Admin access denied!" });
    }

    // Create token with appropriate payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      isAdmin: isAdmin ? true : false
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
        isAdmin: isAdmin ? true : false
      });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
