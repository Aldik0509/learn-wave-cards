
import { useState, useEffect, useRef } from 'react';
import { FlashCardData } from './FlashCard';
import { Timer, Star, Trophy, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MarathonModeProps {
  cards: FlashCardData[];
}

interface AnswerOption {
  value: string;
  label: string;
  isFormula?: boolean;
}

const INITIAL_TIME = 60; // 60 секунд на марафон
const TIME_PENALTY = 3; // штраф за неправильный ответ
const TIME_BONUS = 2; // бонус за правильный ответ

const MarathonMode = ({ cards }: MarathonModeProps) => {
  const [marathonCards, setMarathonCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnswerVerified, setIsAnswerVerified] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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
    } else if (isPlaying && timeLeft <= 0) {
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
    if (inputRef.current && isPlaying && !isAnswerVerified) {
      inputRef.current.focus();
    }
  }, [currentCardIndex, isPlaying, isAnswerVerified]);

  const isFormulaAnswer = (answer: string): boolean => {
    // Check if the answer contains mathematical symbols or notation
    return /[\+\-\*\/\=\(\)\[\]\{\}\^\d√∫∑π]/.test(answer) && 
           (/[a-zA-Z]/.test(answer) || answer.includes('=')) &&
           (answer.includes('=') || answer.includes('/') || answer.includes('^') || answer.includes('√'));
  };

  const generateAnswerOptions = (currentCard: FlashCardData) => {
    // Determine if the correct answer is a formula
    const isFormula = isFormulaAnswer(currentCard.answer);
    
    // Get 3 random incorrect answers from other cards
    const otherAnswers = cards
      .filter(card => card.id !== currentCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(card => ({
        value: card.answer,
        label: card.answer,
        isFormula: isFormulaAnswer(card.answer)
      }));

    // Create array of options including the correct one
    const options = [
      { value: currentCard.answer, label: currentCard.answer, isFormula },
      ...otherAnswers
    ];

    // Shuffle options
    setAnswerOptions(options.sort(() => Math.random() - 0.5));
  };

  const resetMarathon = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setMarathonCards(shuffled);
    setCurrentCardIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setIsPlaying(false);
    setGameOver(false);
    setFeedbackState(null);
    setIsAnswerVerified(false);
    
    if (shuffled.length > 0) {
      generateAnswerOptions(shuffled[0]);
    }
  };

  const startGame = () => {
    resetMarathon();
    setIsPlaying(true);
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    // Remove immediate feedback
    setFeedbackState(null);
  };

  const verifyAnswer = () => {
    if (!selectedAnswer) {
      toast.error('Пожалуйста, выберите ответ');
      return;
    }

    const currentCard = marathonCards[currentCardIndex];
    const isCorrect = selectedAnswer === currentCard.answer;
    
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    setIsAnswerVerified(true);
    
    // Apply time penalty/bonus
    if (isCorrect) {
      setTimeLeft(prev => prev + TIME_BONUS);
      toast.success(`+${TIME_BONUS} секунды!`);
    } else {
      setTimeLeft(prev => Math.max(1, prev - TIME_PENALTY));
      toast.error(`-${TIME_PENALTY} секунды!`);
    }
  };
  
  const handleNextQuestion = () => {
    if (feedbackState === 'correct') {
      setScore((prev) => prev + 1);
    }
    
    // Переходим к следующей карточке или перемешиваем, если закончились
    if (currentCardIndex < marathonCards.length - 1) {
      setCurrentCardIndex((prev) => {
        const nextIndex = prev + 1;
        generateAnswerOptions(marathonCards[nextIndex]);
        return nextIndex;
      });
    } else {
      // Перемешиваем карточки и начинаем заново
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setMarathonCards(shuffled);
      setCurrentCardIndex(0);
      generateAnswerOptions(shuffled[0]);
    }
    
    setSelectedAnswer(null);
    setFeedbackState(null);
    setIsAnswerVerified(false);
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

          <div className="mb-6 space-y-3 text-left border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Правила:</p>
            <div className="flex items-start gap-2">
              <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">Правильный ответ: +{TIME_BONUS} секунды</p>
            </div>
            <div className="flex items-start gap-2">
              <X size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">Неправильный ответ: -{TIME_PENALTY} секунды</p>
            </div>
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
            
            <div className="mt-6 space-y-4">
              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={handleAnswerChange}
                disabled={isAnswerVerified}
              >
                {answerOptions.map((option, index) => (
                  <div key={index} className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                    isAnswerVerified && selectedAnswer === option.value && feedbackState === 'correct' 
                      ? 'bg-[#F2FCE2] border border-green-400' 
                      : isAnswerVerified && selectedAnswer === option.value && feedbackState === 'incorrect'
                      ? 'bg-red-50 border border-red-400'
                      : isAnswerVerified && option.value === currentCard.answer
                      ? 'bg-[#F2FCE2] border border-green-400'
                      : 'hover:bg-gray-50'
                  }`}>
                    <RadioGroupItem
                      value={option.value}
                      id={`option-${index}`}
                      className="border-2 border-physics-purple/50"
                      disabled={isAnswerVerified}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className={`text-lg font-medium cursor-pointer flex-grow ${option.isFormula ? 'font-mono' : ''}`}
                    >
                      {option.label}
                    </Label>
                    
                    {isAnswerVerified && ((selectedAnswer === option.value && feedbackState === 'correct') || 
                    (option.value === currentCard.answer && selectedAnswer !== option.value)) && (
                      <Check size={20} className="text-green-500 shrink-0" />
                    )}
                    
                    {isAnswerVerified && selectedAnswer === option.value && feedbackState === 'incorrect' && (
                      <X size={20} className="text-[#ea384c] shrink-0" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <button
              onClick={isAnswerVerified ? handleNextQuestion : verifyAnswer}
              className={`w-full mt-4 py-3 text-white rounded-md hover:opacity-90 transition-colors ${
                isAnswerVerified && feedbackState === 'correct' ? 'bg-green-500' : 
                isAnswerVerified && feedbackState === 'incorrect' ? 'bg-[#ea384c]' : 'bg-physics-cyan hover:bg-physics-blue'
              }`}
              disabled={!selectedAnswer && !isAnswerVerified}
            >
              {isAnswerVerified ? "Следующий вопрос" : "Проверить"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarathonMode;
