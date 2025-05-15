import { useState } from "react";

function App() {
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3001/api/question");
    const data = await response.json();
    setQuestion(data);
    setFeedback("");
    setLoading(false);
  };

  const handleAnswer = async (answer) => {
    const response = await fetch("http://localhost:3001/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, question }),
    });
    const result = await response.json();
    setFeedback(result.feedback);
    setTimeout(fetchQuestion, 3000);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      {!question ? (
        <button className="text-xl p-4 bg-blue-600 text-white rounded" onClick={fetchQuestion}>
          Börja plugga
        </button>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{question.text}</h2>
          <div className="flex flex-col gap-2">
            {question.choices.map((choice, i) => (
              <button
                key={i}
                className="p-2 border rounded hover:bg-blue-100"
                onClick={() => handleAnswer(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
          <p className="mt-4 text-green-700 font-medium">{feedback}</p>
        </div>
      )}
      {loading && <p>Laddar fråga...</p>}
    </div>
  );
}

export default App;
