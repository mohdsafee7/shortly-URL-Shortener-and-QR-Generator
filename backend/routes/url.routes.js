import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Url from '../models/UrlSchema.js';
import { nanoid } from 'nanoid';

const router = express.Router();

router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if(!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    //check if the URL is correct or not
    try { 
      new URL(originalUrl); //It is a built-in URL constructor in JavaScript that parses a string and checks if it's a valid URL. 
      // If the string is not a valid URL, it will throw an error, which we catch to return a 400 Bad Request response.
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let shortId;
    let exists = true;

    // Generate a unique shortId
    while(exists) {
      shortId = nanoid(7);
      exists = await Url.findOne({ shortId });
    }

    const url = await Url.create({ 
      shortId,
      originalUrl,
    });

    res.json({
      shortId: url.shortId,
      shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
    })

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({error: "Server error"});
  }
});

router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if(!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    //agar URL mil jaye to uske clicks ko increment karna hai
    url.click += 1;
    //uske baad us URL ko save karna hai
    await url.save(); //it is used to save the updated URL document back to the database after incrementing the click count.

    res.redirect(url.originalUrl); //it is used to redirect the client to the original URL associated with the shortId. 
    // When a user accesses the shortened URL, they will be redirected to the original URL stored in the database.
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;