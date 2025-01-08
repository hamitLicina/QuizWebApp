import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/questions');
        setQuestions(response.data as Question[]);
        setError(null);
      } catch (error) {
        setError('Sorular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  useEffect(() => {
    if (questions.length > 0 && !showResult) {
      setTimeLeft(30);
      setIsTimerActive(true);
    }
  }, [currentQuestion, questions]);

  const handleTimeUp = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      setIsTimerActive(false);
    }
  };

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      setIsTimerActive(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-center p-4">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          {!showResult && questions.length > 0 ? (
            <>
              <div className="max-w-md mx-auto">
                <div className="mb-4 text-center">
                  <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                    Kalan Süre: {timeLeft} saniye
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4 text-center">
                  <span className="text-gray-500">
                    Soru {currentQuestion + 1}/{questions.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <h2 className="text-2xl font-bold mb-4">{questions[currentQuestion].question}</h2>
                    <div className="space-y-4">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className="w-full p-4 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Bitti!</h2>
              <p className="text-xl mb-6">
                Toplam Puanınız: {score}/{questions.length}
              </p>
              <p className="mb-6 text-gray-600">
                Başarı Oranı: {((score / questions.length) * 100).toFixed(1)}%
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tekrar Başla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 