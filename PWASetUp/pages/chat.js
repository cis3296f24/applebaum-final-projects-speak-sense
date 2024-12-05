const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

// Initialize dotenv to load .env file
dotenv.config();
console.log('API Key loaded:', !!process.env.OPENAI_API_KEY);

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Express app
const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to interact with OpenAI
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // Increased for longer responses
      temperature: 0.7,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).send('Error with OpenAI request');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});