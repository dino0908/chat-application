import routes from "./routes/routes.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import pool from "./config/db.js";

const app = express();
const httpServer = createServer(app);
const PORT = 5000;

const userSocketMap = {}; // { userId: socketId }

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; // userId of client, passed by client in SocketContext

  userSocketMap[userId] = socket.id; // add user id : socket id mapping

  socket.on("send_message", async ({ conversationId, recipientId, content }) => {
    try {
      console.log("send message event received by server", conversationId, recipientId, content)
      // Save message to database
      const result = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, message_text, is_read, created_at)
         VALUES ($1, $2, $3, false, NOW())
         RETURNING id, message_text, created_at, sender_id`,
        [conversationId, userId, content]
      );

      const savedMessage = result.rows[0];

      // Emit to recipient
      const recipientSocketId = userSocketMap[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", {
          id: savedMessage.id,
          text: savedMessage.message_text,
          time: savedMessage.created_at,
          self: false,
          senderId: userId,
          conversationId: conversationId,
        });
      }

      // Emit back to sender (confirmation + update UI)
      socket.emit("message_sent", {
        id: savedMessage.id,
        text: savedMessage.message_text,
        time: savedMessage.created_at,
        self: true,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Mark messages as read when user views a chat
  socket.on("mark_as_read", async ({ conversationId }) => {
    try {
      await pool.query(
        `UPDATE messages 
         SET is_read = true 
         WHERE conversation_id = $1 
           AND sender_id != $2 
           AND is_read = false`,
        [conversationId, userId]
      );
      console.log(`Messages in conversation ${conversationId} marked as read for user ${userId}`);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  });
});

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // This allows the browser to accept the cookie
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use(express.json());
app.use("/api", routes);

httpServer.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});
