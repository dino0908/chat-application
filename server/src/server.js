import routes from "./routes/routes.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

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
  const userId = socket.handshake.query.userId; // userId of client

  userSocketMap[userId] = socket.id; // add user id : socket id mapping

  socket.on("send_message", ({ recipientId, content }) => {
    try {

      // logic to save message to DB


      const recipientSocketId = userSocketMap[recipientId];

      if (recipientSocketId) {
        // Send only to the specific person
        io.to(recipientSocketId).emit("receive_message", {
          senderId,
          content,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  // socket.on("disconnect", () => {
  //   const disconnectedUserID = Object.keys(userSocketMap).find(
  //     (key) => userSocketMap[key] === socket.id,
  //   );
  //   if (disconnectedUserID) {
  //     delete userSocketMap[disconnectedUserID];
  //   }
  // });
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
