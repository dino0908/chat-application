import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie('token', token, {
      httpOnly: true,         // Prevents JS access (XSS protection)
    //   secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in prod
      sameSite: 'strict',     // CSRF protection
      maxAge: 3600000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "Username or Email already in use",
      });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Store in Database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword],
    );

    console.log("User registered:", newUser.rows[0]);

    res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC",
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const verifyJWT = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.status(200).json({ 
      id: verified.id,
      username: verified.username,
      email: verified.email,
    });

  } catch (err) {
    res.status(401).json({ isLoggedIn: false });
  }
};