const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

// Initialize dotenv to load .env file
dotenv.config();

console.log('API Key loaded:', !!process.env.OPENAI_API_KEY);

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Set up Express app
const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', '*'],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Endpoint to interact with OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { prompt } = req.body;

    if (!prompt) {
      console.log("No prompt received");
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    console.log("OpenAI Response received");
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});