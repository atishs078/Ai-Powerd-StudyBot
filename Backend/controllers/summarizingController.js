const fs = require('fs');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const summarizeText = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = file.path;
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Summarize the following content:\n\n${content}` }
      ],
      temperature: 0.5,
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'GPT summarization failed' });
  }
};

module.exports = { summarizeText };