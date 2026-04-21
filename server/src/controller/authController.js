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
