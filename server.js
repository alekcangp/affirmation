const cors = require('cors');
require('dotenv').config();

const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const themes = {
  'самооценка': 'самооценка и принятие себя',
  'уверенность': 'уверенность в себе и своих силах',
  'любовь': 'любовь к себе и забота о себе',
  'успех': 'успех в жизни и достижение целей',
  'здоровье': 'здоровье и хорошее самочувствие',
  'финансы': 'финансовый успех и изобилие',
  'отношения': 'гармоничные отношения с собой и другими'
};

app.post('/api/generate', async (req, res) => {
  const { gender, theme, customText } = req.body;
  
  const genderText = gender === 'male' ? 'мужчины' : 'женщины';
  const themeText = themes[theme] || customText || theme;
  
  const prompt = `Сгенерируй 5 коротких позитивных аффирмаций для ${genderText}.
Тема: ${themeText}.
Каждая аффирмация должна быть 1-2 предложения, вдохновляющая, для ежедневного повторения.
Ответь ТОЛЬКО списком из 5 аффирмаций на русском языке, без нумерации, без дополнительного текста.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemma-4-31b-it",
      contents: prompt
    });
    
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const affirmations = text.split('\n').filter(line => line.trim()).slice(0, 5);
    
    res.json({ affirmations });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'Ошибка генерации. Попробуйте еще раз.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});

module.exports = app;