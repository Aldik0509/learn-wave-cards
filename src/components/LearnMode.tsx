
import FlashCard, { FlashCardData } from './FlashCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface LearnModeProps {
  cards: FlashCardData[];
}

const LearnMode = ({ cards }: LearnModeProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          Карточка {currentCardIndex + 1} из {cards.length}
        </p>
      </div>

      <div className="flex justify-center">
        <FlashCard key={currentCard.id} card={currentCard} />
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentCardIndex === 0}
          className={`p-3 rounded-full ${
            currentCardIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-physics-blue/10 text-physics-blue hover:bg-physics-blue/20'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentCardIndex === cards.length - 1}
          className={`p-3 rounded-full ${
            currentCardIndex === cards.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-physics-blue/10 text-physics-blue hover:bg-physics-blue/20'
          }`}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default LearnMode;
