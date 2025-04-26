
import { useState, useEffect } from 'react';
import { FlashCardData } from './FlashCard';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TestModeProps {
  cards: FlashCardData[];
}

interface AnswerOption {
  value: string;
  label: string;
}

const TestMode = ({ cards }: TestModeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(cards.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [testCards, setTestCards] = useState<FlashCardData[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setTestCards(shuffled);
    setUserAnswers(Array(cards.length).fill(''));
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    generateAnswerOptions(shuffled[0]);
  }, [cards]);

  const generateAnswerOptions = (currentCard: FlashCardData) => {
    // Получаем 3 случайные неправильные ответа из других карточек
    const otherAnswers = cards
      .filter(card => card.id !== currentCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(card => card.answer);

    // Создаем массив вариантов ответов, включая правильный
    const options = [
      { value: currentCard.answer, label: currentCard.answer },
      ...otherAnswers.map(answer => ({ value: answer, label: answer }))
    ];

    // Перемешиваем варианты ответов
    setAnswerOptions(options.sort(() => Math.random() - 0.5));
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswers[currentQuestionIndex]) {
      toast.error('Пожалуйста, выберите ответ');
      return;
    }

    if (currentQuestionIndex < testCards.length - 1) {
      setCurrentQuestionIndex(prev => {
        const nextIndex = prev + 1;
        generateAnswerOptions(testCards[nextIndex]);
        return nextIndex;
      });
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    testCards.forEach((card, index) => {
      if (userAnswers[index] === card.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const handleRestartTest = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setTestCards(shuffled);
    setUserAnswers(Array(cards.length).fill(''));
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    generateAnswerOptions(shuffled[0]);
  };

  if (showResults) {
    const percentage = Math.round((score / testCards.length) * 100);
    
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-physics-purple/20">
          <h2 className="text-2xl font-bold text-center mb-6">Результаты теста</h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-physics-blue to-physics-purple text-white">
              {percentage}%
            </div>
          </div>
          
          <p className="text-center text-xl mb-2">
            Верно ответов: {score} из {testCards.length}
          </p>
          
          <p className="text-center mb-8 text-muted-foreground">
            {percentage >= 80 
              ? 'Отличный результат! Вы отлично понимаете основы волн.' 
              : percentage >= 60 
              ? 'Хороший результат! Но есть над чем поработать.' 
              : 'Стоит повторить материал и попробовать еще раз.'}
          </p>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleRestartTest}
              className="px-6 py-3 bg-physics-purple text-white rounded-full hover:bg-physics-indigo transition-colors"
            >
              Пройти тест еще раз
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = testCards[currentQuestionIndex];
  
  return (
    <div className="container mx-auto max-w-2xl px-4">
      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-physics-purple/20">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Вопрос {currentQuestionIndex + 1} из {testCards.length}
          </p>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{currentCard?.question}</h3>
        
        {currentCard?.image && (
          <div className="mb-4 flex justify-center">
            <img src={currentCard.image} alt="Иллюстрация" className="max-h-40 object-contain" />
          </div>
        )}
        
        <div className="mt-6 space-y-4">
          <RadioGroup
            value={userAnswers[currentQuestionIndex]}
            onValueChange={handleAnswerChange}
          >
            {answerOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`option-${index}`}
                  className="border-2 border-physics-purple/50"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-lg font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <button
          onClick={handleSubmitAnswer}
          className="w-full mt-6 py-3 bg-physics-purple text-white rounded-md hover:bg-physics-indigo transition-colors"
        >
          {currentQuestionIndex < testCards.length - 1 ? "Следующий вопрос" : "Завершить тест"}
        </button>
      </div>
    </div>
  );
};

export default TestMode;
