
import { useState, useEffect } from 'react';
import { FlashCardData } from './FlashCard';
import { toast } from 'sonner';
import { Puzzle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchingGameProps {
  cards: FlashCardData[];
}

interface MatchingItem {
  id: string;
  content: string;
  type: 'question' | 'answer';
  originalId: number;
  isMatched: boolean;
  isSelected: boolean;
}

const MatchingGame = ({ cards }: MatchingGameProps) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [matchingItems, setMatchingItems] = useState<MatchingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchingItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (cards.length > 0) {
      prepareGame();
    }
  }, [cards]);

  const prepareGame = () => {
    // Take up to 6 cards for the game (12 items total)
    const gameCards = [...cards].sort(() => Math.random() - 0.5).slice(0, 6);
    
    // Create matching items from cards
    const items: MatchingItem[] = [];
    gameCards.forEach(card => {
      // Add question
      items.push({
        id: `q-${card.id}`,
        content: card.question,
        type: 'question',
        originalId: card.id,
        isMatched: false,
        isSelected: false
      });
      
      // Add answer
      items.push({
        id: `a-${card.id}`,
        content: card.answer,
        type: 'answer',
        originalId: card.id,
        isMatched: false,
        isSelected: false
      });
    });
    
    // Shuffle items
    setMatchingItems(items.sort(() => Math.random() - 0.5));
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  };

  const handleItemClick = (item: MatchingItem) => {
    // If the item is already matched or selected, do nothing
    if (item.isMatched || item.isSelected) {
      return;
    }
    
    // If no item is selected, select this one
    if (!selectedItem) {
      setMatchingItems(current => 
        current.map(i => i.id === item.id ? { ...i, isSelected: true } : i)
      );
      setSelectedItem(item);
      return;
    }
    
    // If an item is already selected
    setMoves(moves => moves + 1);
    
    // Check if they match (same original card id but different types)
    if (selectedItem.originalId === item.originalId && selectedItem.type !== item.type) {
      // It's a match!
      toast.success("Match found!");
      setMatchingItems(current => 
        current.map(i => 
          (i.id === item.id || i.id === selectedItem.id) 
            ? { ...i, isMatched: true, isSelected: false } 
            : i
        )
      );
      setMatchedPairs(pairs => pairs + 1);
      setSelectedItem(null);
      
      // Check if game is completed
      if (matchedPairs + 1 === cards.slice(0, 6).length) {
        setGameCompleted(true);
        toast.success("Game completed!");
      }
    } else {
      // Not a match - briefly show the item, then hide both
      setMatchingItems(current => 
        current.map(i => i.id === item.id ? { ...i, isSelected: true } : i)
      );
      
      // Wait a second before hiding both
      setTimeout(() => {
        setMatchingItems(current => 
          current.map(i => 
            (i.id === item.id || i.id === selectedItem.id) 
              ? { ...i, isSelected: false } 
              : i
          )
        );
        setSelectedItem(null);
      }, 1000);
    }
  };

  const startNewGame = () => {
    prepareGame();
    setIsGameStarted(true);
  };

  if (!isGameStarted || gameCompleted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-physics-purple/20 text-center">
          <Puzzle size={64} className="mx-auto mb-4 text-physics-indigo" />
          
          <h2 className="text-2xl font-bold mb-6">
            {gameCompleted ? "Game Completed!" : "Matching Game"}
          </h2>
          
          {gameCompleted && (
            <div className="mb-6">
              <p className="text-xl mb-2">You completed the game in {moves} moves</p>
              <p className="text-gray-500">
                {moves <= cards.slice(0, 6).length + 2 
                  ? "Excellent! Great memory!" 
                  : moves <= cards.slice(0, 6).length * 2 
                  ? "Well done!" 
                  : "Keep practicing!"}
              </p>
            </div>
          )}
          
          {!gameCompleted && (
            <p className="mb-6 text-gray-600">
              Match each question with its correct answer. Find all pairs with the fewest moves!
            </p>
          )}
          
          <button
            onClick={startNewGame}
            className="px-6 py-3 bg-physics-purple text-white rounded-full hover:bg-physics-indigo transition-colors"
          >
            {gameCompleted ? "Play Again" : "Start Game"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Pairs found: {matchedPairs} of {cards.slice(0, 6).length}
        </p>
        <p className="text-sm text-gray-500">
          Moves: {moves}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {matchingItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={cn(
              "bg-white rounded-lg p-4 min-h-32 shadow-sm border-2 transition-all cursor-pointer flex flex-col justify-center",
              item.isMatched 
                ? "border-green-500 bg-green-50" 
                : item.isSelected
                ? "border-physics-purple" 
                : "border-gray-200 hover:border-physics-purple/50"
            )}
          >
            <div className="text-center">
              {(item.isSelected || item.isMatched) ? (
                <p className={cn(
                  "text-sm md:text-base",
                  item.type === 'question' ? "font-semibold" : "font-medium"
                )}>
                  {item.content}
                </p>
              ) : (
                <p className="text-xl text-gray-400">?</p>
              )}
            </div>
            {item.isMatched && (
              <div className="absolute top-2 right-2">
                <Check size={16} className="text-green-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingGame;
