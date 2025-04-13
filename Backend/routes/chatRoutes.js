const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // 👇 Add formatting instruction to make Gemini respond in list/pointwise
    const modifiedPrompt = `Respond in bullet points or a numbered list format.\n\n${prompt}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: modifiedPrompt }] }]
    });

    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      error: "API request failed",
      details: {
        message: error.message,
        modelUsed: "gemini-1.5-pro-latest",
        suggestion: "Check your API key and project permissions in Google Cloud Console",
        status: error.status,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

module.exports = router;
