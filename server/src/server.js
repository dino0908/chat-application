import routes from "./routes/routes.js"
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();       
const PORT = 5000;          

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


app.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});