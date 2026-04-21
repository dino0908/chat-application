import pool from "../config/db.js";

export const login = (req, res) => {
  //   const { email, password } = req.body;
  //   console.log("Login Attempt:", { email, password });

  // For now, just send a success response
  res.status(200).json({ message: "Login endpoint hit successfully" });
};

export const register = (req, res) => {
  //   const { username, email, password } = req.body;
  //   console.log("Register Attempt:", { username, email, password });

  res.status(201).json({ message: "Register endpoint hit successfully" });
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

