
import { useState } from 'react';
import Header from '@/components/Header';
import LearnMode from '@/components/LearnMode';
import TestMode from '@/components/TestMode';
import MarathonMode from '@/components/MarathonMode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlashCardData } from '@/components/FlashCard';
import { physicsCards } from '@/data/physicsCards';
import { algebraCards } from '@/data/algebraCards';
import { geometryCards } from '@/data/geometryCards';

const Index = () => {
  const [mode, setMode] = useState<'learn' | 'test' | 'marathon'>('learn');
  const [selectedGrade, setSelectedGrade] = useState<string>("7");
  const [subject, setSubject] = useState<'physics' | 'algebra' | 'geometry'>('physics');

  const handleModeChange = (newMode: 'learn' | 'test' | 'marathon') => {
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
            <SelectValue placeholder="Выберите класс" />
          </SelectTrigger>
          <SelectContent>
            {[7, 8, 9, 10, 11].map((grade) => (
              <SelectItem key={grade} value={grade.toString()}>
                {grade} класс
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
          </>
        ) : (
          <div className="text-center text-gray-500">
            Для этого класса пока нет карточек
          </div>
        )}
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Образовательные карточки для 7-11 классов</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
