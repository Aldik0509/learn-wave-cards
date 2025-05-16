
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FlashCardData {
  id: number;
  question: string;
  answer: string;
  image?: string;
  grade?: number;
}

interface FlashCardProps {
  card: FlashCardData;
  className?: string;
}

const FlashCard = ({ card, className }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn(
        "flip-card w-full max-w-md h-64 select-none cursor-pointer mb-6",
        isFlipped ? "flipped" : "",
        className
      )}
      onClick={handleFlip}
    >
      <div className="flip-card-inner w-full h-full shadow-lg rounded-xl">
        <div className="flip-card-front bg-white rounded-xl p-6 shadow-md border-2 border-physics-purple/20">
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold text-center text-gray-800">{card.question}</h3>
            {card.image && (
              <div className="mt-3">
                <img src={card.image} alt="Illustration" className="max-h-24 object-contain" />
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">Click to see the answer</p>
          </div>
        </div>
        <div className="flip-card-back bg-gradient-to-br from-physics-indigo to-physics-purple rounded-xl p-6 text-white">
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold mb-3">Answer:</h3>
            <p className="text-center text-lg">{card.answer}</p>
            <p className="mt-4 text-sm text-white/70">Click to return to the question</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
