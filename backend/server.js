import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/url.routes.js';

dotenv.config();
const app = express();

app.use(cors({  // Allow requests from the frontend
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
})); 

app.use(express.json());

app.use('/', urlRoutes); // Mount the URL routes at the root path

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


mongoose.connect(process.env.MONGO_URI)
.then(() =>{
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})

.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});