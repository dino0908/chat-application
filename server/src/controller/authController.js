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

    res.cookie("token", token, {
      httpOnly: true, // Prevents JS access (XSS protection)
      //   secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 3600000,
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

// middleware
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach the user info to the request object
    req.user = verified; 
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token is not valid" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // same settings as when you set it
    sameSite: "strict",
    path: "/", // Ensure this matches the path used when the cookie was created
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

// get the chats the user is in, to display on the left side of the chats page
export const getChats = async (req, res) => {
  const userId = req.user?.id  // The middleware should have attached the user to the request object

  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const query = `
  SELECT 
    c.id AS conversation_id,
    u.username AS username,
    u.is_online AS online,
    lm.message_text AS "lastMessage",
    lm.created_at AS time,
    (
        SELECT COUNT(*)::INT 
        FROM messages 
        WHERE conversation_id = c.id 
          AND sender_id != $1  -- $1 is the Logged-in User's ID
          AND is_read = FALSE
    ) AS unread
FROM conversations c
-- 1. Find conversations where the current user is a participant
JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = $1
-- 2. Find the "other" participant in those same conversations
JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != $1
-- 3. Get the "other" participant's profile info
JOIN users u ON cp2.user_id = u.id
-- 4. Get only the single latest message for the preview
LEFT JOIN LATERAL (
    SELECT message_text, created_at 
    FROM messages 
    WHERE conversation_id = c.id 
    ORDER BY created_at DESC 
    LIMIT 1
) lm ON true
ORDER BY lm.created_at DESC;`;

  try {
    const result = await pool.query(query, [userId]);
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
