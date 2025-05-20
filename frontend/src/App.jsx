import { useState } from 'react';

export default function App() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  async function fetchQuestion() {
    try {
      const res = await fetch('/api/question?category=Trafikregler');
      const data = await res.json();
      setQuestion(data);
      setAnswer('');
      setResult('');
    } catch (err) {
      console.error('❌ Kunde inte hämta fråga:', err);
    }
  }

  function checkAnswer(selected) {
    setAnswer(selected);
    if (selected === question.correct) {
      setResult('✅ Rätt!');
    } else {
      setResult(`❌ Fel. Rätt svar är ${question.correct}`);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Teorifrågor</h1>
      {!question && (
        <button onClick={fetchQuestion}>Hämta fråga</button>
      )}

      {question && (
        <div>
          <h2>{question.text}</h2>
          <ul>
            {['A', 'B', 'C'].map((option) => (
              <li key={option}>
                <button onClick={() => checkAnswer(option)}>
                  {option}: {question[option]}
                </button>
              </li>
            ))}
          </ul>
          {result && <p>{result}</p>}
          <button onClick={fetchQuestion}>Nästa fråga</button>
        </div>
      )}
    </div>
  );
}
