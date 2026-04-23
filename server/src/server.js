import routes from "./routes/routes.js"
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import { Server } from "socket.io"

const app = express(); 
const httpServer = createServer(app);      
const PORT = 5000;          

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, // This allows the browser to accept the cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(express.json())
app.use('/api', routes)


httpServer.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});