const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.get("/api/question", async (req, res) => {
  const category = req.query.category || "Trafikregler";
  const prompt = `Skapa en körkortsfråga inom kategorin ${category}. Ge:
- en fråga,
- fyra svarsalternativ (A–D),
- vilket som är rätt svar,
- och en kort förklaring till varför.`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.data.choices[0].message.content;
  const parsed = parseQuestion(content);
  res.json(parsed);
});

app.post("/api/answer", async (req, res) => {
  const { answer, question } = req.body;
  const isCorrect = answer === question.correct;
  if (isCorrect) {
    res.json({ feedback: "Rätt svar! Bra jobbat! 💪", correct: true });
  } else {
    res.json({
      feedback: `Fel svar. Rätt svar är: ${question.correct}.\n${question.explanation}`,
      correct: false
    });
  }
});

function parseQuestion(content) {
  const lines = content.split("\n");
  const text = lines[0];
  const choices = lines.slice(1, 5).map(line => line.replace(/^[A-D]\)\s*/, ""));
  const correctLine = lines.find(line => line.toLowerCase().includes("rätt svar"));
  const correct = correctLine ? correctLine.match(/[A-D]/)?.[0] : "A";
  const explanation = lines.slice(-1)[0];

  return {
    text,
    choices,
    correct: choices["ABCD".indexOf(correct)],
    explanation,
  };
}

const PORT = 3001;
app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));
