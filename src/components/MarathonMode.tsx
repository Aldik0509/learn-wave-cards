
import { useState, useEffect, useRef } from 'react';
import { FlashCardData } from './FlashCard';
import { Timer, Star, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface MarathonModeProps {
  cards: FlashCardData[];
}

const INITIAL_TIME = 60; // 60 секунд на марафон

const MarathonMode = ({ cards }: MarathonModeProps) => {
  const [marathonCards, setMarathonCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Перемешиваем карточки для марафона
    resetMarathon();
  }, [cards]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setGameOver(true);
      setIsPlaying(false);
      toast.info("Время вышло!");
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    // Фокус на поле ввода при изменении текущей карточки
    if (inputRef.current && isPlaying) {
      inputRef.current.focus();
    }
  }, [currentCardIndex, isPlaying]);

  const resetMarathon = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setMarathonCards(shuffled);
    setCurrentCardIndex(0);
    setUserAnswer('');
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setIsPlaying(false);
    setGameOver(false);
  };

  const startGame = () => {
    resetMarathon();
    setIsPlaying(true);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentCard = marathonCards[currentCardIndex];
    const userAnswerLower = userAnswer.toLowerCase().trim();
    const correctAnswerLower = currentCard.answer.toLowerCase();

    // Проверяем ответ (с некоторой гибкостью)
    if (correctAnswerLower.includes(userAnswerLower) || 
        userAnswerLower.includes(correctAnswerLower) || 
        (userAnswerLower.length > 3 && correctAnswerLower.includes(userAnswerLower.substring(0, userAnswerLower.length - 1)))) {
      setScore((prev) => prev + 1);
      toast.success("Правильно! +1 очко");
    } else {
      toast.error(`Неверно! Правильный ответ: ${currentCard.answer}`);
    }

    // Переходим к следующей карточке или перемешиваем, если закончились
    if (currentCardIndex < marathonCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Перемешиваем карточки и начинаем заново
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setMarathonCards(shuffled);
      setCurrentCardIndex(0);
    }
    
    setUserAnswer('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  if (gameOver) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-physics-purple/20 text-center">
          <Trophy size={64} className="mx-auto mb-4 text-physics-indigo animate-pulse-light" />
          
          <h2 className="text-2xl font-bold mb-6">Марафон завершен!</h2>
          
          <p className="text-4xl font-bold text-physics-purple mb-4">{score} очков</p>
          
          <p className="text-gray-600 mb-8">
            {score > 10 
              ? "Потрясающий результат! Вы настоящий эксперт по волнам!" 
              : score > 5 
              ? "Хороший результат! Можете попробовать еще раз, чтобы побить свой рекорд." 
              : "Попробуйте еще раз и улучшите свой результат!"}
          </p>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-physics-purple text-white rounded-full hover:bg-physics-indigo transition-colors"
          >
            Играть снова
          </button>
        </div>
      </div>
    );
  }

  const currentCard = marathonCards[currentCardIndex];

  return (
    <div className="container mx-auto max-w-2xl px-4">
      {!isPlaying ? (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-physics-purple/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Марафон по волнам</h2>
          
          <p className="mb-6 text-gray-600">
            Ответьте правильно на как можно больше вопросов за 60 секунд!
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <Timer size={24} className="text-physics-cyan" />
            <span className="text-xl font-semibold">{INITIAL_TIME} секунд</span>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-physics-cyan text-white rounded-full hover:bg-physics-blue transition-colors text-lg font-medium"
          >
            Начать марафон!
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-physics-purple/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-physics-cyan">
              <Timer size={18} className="mr-1" />
              <span className="font-bold text-lg">{timeLeft}</span>
            </div>
            <div className="flex items-center text-physics-indigo">
              <Star size={18} className="mr-1" />
              <span className="font-bold text-lg">{score}</span>
            </div>
          </div>
          
          <div className="py-4">
            <h3 className="text-xl font-semibold mb-4">{currentCard?.question}</h3>
            
            {currentCard?.image && (
              <div className="mb-4 flex justify-center">
                <img src={currentCard.image} alt="Иллюстрация" className="max-h-36 object-contain" />
              </div>
            )}
            
            <div className="mt-6">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-physics-indigo"
                placeholder="Введите ответ..."
              />
            </div>
            
            <button
              onClick={checkAnswer}
              className="w-full mt-4 py-3 bg-physics-cyan text-white rounded-md hover:bg-physics-blue transition-colors"
              disabled={!userAnswer.trim()}
            >
              Ответить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarathonMode;
