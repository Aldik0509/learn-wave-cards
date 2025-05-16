
import { useState } from 'react';
import Header from '@/components/Header';
import LearnMode from '@/components/LearnMode';
import TestMode from '@/components/TestMode';
import MarathonMode from '@/components/MarathonMode';
import MatchingGame from '@/components/MatchingGame';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlashCardData } from '@/components/FlashCard';
import { physicsCards } from '@/data/physicsCards';
import { algebraCards } from '@/data/algebraCards';
import { geometryCards } from '@/data/geometryCards';

const Index = () => {
  const [mode, setMode] = useState<'learn' | 'test' | 'marathon' | 'matching'>('learn');
  const [selectedGrade, setSelectedGrade] = useState<string>("7");
  const [subject, setSubject] = useState<'physics' | 'algebra' | 'geometry'>('physics');

  const handleModeChange = (newMode: 'learn' | 'test' | 'marathon' | 'matching') => {
    setMode(newMode);
  };

  const handleSubjectChange = (newSubject: 'physics' | 'algebra' | 'geometry') => {
    setSubject(newSubject);
  };

  const getCardsForCurrentSubject = () => {
    switch (subject) {
      case 'physics':
        return physicsCards;
      case 'algebra':
        return algebraCards;
      case 'geometry':
        return geometryCards;
      default:
        return physicsCards;
    }
  };

  const filteredCards = getCardsForCurrentSubject().filter(
    card => card.grade === parseInt(selectedGrade)
  );

  return (
    <div className="min-h-screen py-6">
      <Header 
        onModeChange={handleModeChange} 
        currentMode={mode} 
        onSubjectChange={handleSubjectChange}
        currentSubject={subject}
      />
      
      <div className="container mx-auto max-w-xs mb-8">
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            {[7, 8, 9, 10, 11].map((grade) => (
              <SelectItem key={grade} value={grade.toString()}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <main className="py-6">
        {filteredCards.length > 0 ? (
          <>
            {mode === 'learn' && <LearnMode cards={filteredCards} />}
            {mode === 'test' && <TestMode cards={filteredCards} />}
            {mode === 'marathon' && <MarathonMode cards={filteredCards} />}
            {mode === 'matching' && <MatchingGame cards={filteredCards} />}
          </>
        ) : (
          <div className="text-center text-gray-500">
            No flashcards available for this grade
          </div>
        )}
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Educational Flashcards for Grades 7-11</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
