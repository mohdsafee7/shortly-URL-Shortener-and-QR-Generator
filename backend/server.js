import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

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