
import { useState, useEffect } from 'react';
import { FlashCardData } from './FlashCard';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react';

interface TestModeProps {
  cards: FlashCardData[];
}

interface AnswerOption {
  value: string;
  label: string;
  isFormula?: boolean;
}

const TestMode = ({ cards }: TestModeProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(cards.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [testCards, setTestCards] = useState<FlashCardData[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  
  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setTestCards(shuffled);
    setUserAnswers(Array(cards.length).fill(''));
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedbackState(null);
    if (shuffled.length > 0) {
      generateAnswerOptions(shuffled[0]);
    }
  }, [cards]);

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

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    
    // Check if answer is correct
    const currentCard = testCards[currentQuestionIndex];
    if (value === currentCard.answer) {
      setFeedbackState('correct');
    } else {
      setFeedbackState('incorrect');
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      toast.error('Пожалуйста, выберите ответ');
      return;
    }

    // Save the answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
    
    // Update score if answer was correct
    if (feedbackState === 'correct') {
      setScore(prev => prev + 1);
    }

    // Move to next question
    if (currentQuestionIndex < testCards.length - 1) {
      setCurrentQuestionIndex(prev => {
        const nextIndex = prev + 1;
        generateAnswerOptions(testCards[nextIndex]);
        return nextIndex;
      });
      setSelectedAnswer(null);
      setFeedbackState(null);
    } else {
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
    setSelectedAnswer(null);
    setFeedbackState(null);
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
              ? 'Отличный результат! Вы отлично понимаете предмет.' 
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
  
  if (!currentCard) {
    return <div className="text-center">Загрузка вопросов...</div>;
  }
  
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
            value={selectedAnswer || ""}
            onValueChange={handleAnswerChange}
          >
            {answerOptions.map((option, index) => (
              <div key={index} className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                selectedAnswer === option.value && feedbackState === 'correct' 
                  ? 'bg-[#F2FCE2] border border-green-400' 
                  : selectedAnswer === option.value && feedbackState === 'incorrect'
                  ? 'bg-red-50 border border-red-400'
                  : 'hover:bg-gray-50'
              }`}>
                <RadioGroupItem
                  value={option.value}
                  id={`option-${index}`}
                  className="border-2 border-physics-purple/50"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`text-lg font-medium cursor-pointer flex-grow ${option.isFormula ? 'font-mono' : ''}`}
                >
                  {option.label}
                </Label>
                
                {selectedAnswer === option.value && feedbackState === 'correct' && (
                  <Check size={20} className="text-green-500 shrink-0" />
                )}
                
                {selectedAnswer === option.value && feedbackState === 'incorrect' && (
                  <X size={20} className="text-[#ea384c] shrink-0" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <button
          onClick={handleSubmitAnswer}
          className={`w-full mt-6 py-3 text-white rounded-md hover:bg-physics-indigo transition-colors ${
            feedbackState === 'correct' ? 'bg-green-500' : 
            feedbackState === 'incorrect' ? 'bg-[#ea384c]' : 'bg-physics-purple'
          }`}
        >
          {currentQuestionIndex < testCards.length - 1 ? "Следующий вопрос" : "Завершить тест"}
        </button>
      </div>
    </div>
  );
};

export default TestMode;
