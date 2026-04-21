import routes from "./routes/routes.js"

import express from 'express';
const app = express();       
const PORT = 5000;                

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use(express.json())
app.use('/api', routes)


app.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});