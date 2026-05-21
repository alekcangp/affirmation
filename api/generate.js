const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

if (!apiKey) {
  console.error('API key not found:', process.env);
}

const ai = new GoogleGenAI({ apiKey });

const themes = {
  'самооценка': 'самооценка и принятие себя',
  'уверенность': 'уверенность в себе и своих силах',
  'любовь': 'любовь к себе и забота о себе',
  'успех': 'успех в жизни и достижение целей',
  'здоровье': 'здоровье и хорошее самочувствие',
  'финансы': 'финансовый успех и изобилие',
  'отношения': 'гармоничные отношения с собой и другими'
};

module.exports = async function (req, res) {
  const { gender, theme, customText } = req.body;
  
  const genderText = gender === 'male' ? 'мужчины' : 'женщины';
  const themeText = themes[theme] || customText || theme;
  
  const prompt = `Сгенерируй 5 коротких позитивных аффирмаций для ${genderText}.
Тема: ${themeText}.
Каждая аффирмация должна быть 1-2 предложения, вдохновляющая, для ежедневного повторения.
Ответь ТОЛЬКО списком из 5 аффирмаций на русском языке, без нумерации, без дополнительного текста.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
    });
    
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const affirmations = text.split('\n').filter(line => line.trim()).slice(0, 5);
    
    res.json({ affirmations });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'Ошибка генерации. Попробуйте еще раз.' });
  }
};