
import { useState } from 'react';
import { Timer, Puzzle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface HeaderProps {
  onModeChange: (mode: 'learn' | 'test' | 'marathon' | 'matching') => void;
  currentMode: 'learn' | 'test' | 'marathon' | 'matching';
  onSubjectChange: (subject: 'physics' | 'algebra' | 'geometry') => void;
  currentSubject: 'physics' | 'algebra' | 'geometry';
}

const Header = ({ onModeChange, currentMode, onSubjectChange, currentSubject }: HeaderProps) => {
  return (
    <header className="pt-6 pb-4 mb-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-gradient">
          {currentSubject === 'physics' && 'Physics: Wave Fundamentals'}
          {currentSubject === 'algebra' && 'Algebra: Core Concepts'}
          {currentSubject === 'geometry' && 'Geometry: Key Figures'}
        </h1>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Interactive flashcards for students in grades 7-11
        </p>
        
        <div className="flex justify-center mb-6">
          <ToggleGroup type="single" value={currentSubject} onValueChange={(value) => value && onSubjectChange(value as 'physics' | 'algebra' | 'geometry')}>
            <ToggleGroupItem value="physics" className={`px-4 py-2 ${currentSubject === 'physics' ? 'bg-physics-indigo text-white' : 'bg-white/80'}`}>
              Physics
            </ToggleGroupItem>
            <ToggleGroupItem value="algebra" className={`px-4 py-2 ${currentSubject === 'algebra' ? 'bg-physics-purple text-white' : 'bg-white/80'}`}>
              Algebra
            </ToggleGroupItem>
            <ToggleGroupItem value="geometry" className={`px-4 py-2 ${currentSubject === 'geometry' ? 'bg-physics-cyan text-white' : 'bg-white/80'}`}>
              Geometry
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          <button
            onClick={() => onModeChange('learn')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
              currentMode === 'learn'
                ? 'bg-physics-indigo text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Learn
          </button>
          <button
            onClick={() => onModeChange('test')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
              currentMode === 'test'
                ? 'bg-physics-purple text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Test
          </button>
          <button
            onClick={() => onModeChange('marathon')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all flex items-center gap-1 ${
              currentMode === 'marathon'
                ? 'bg-physics-cyan text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Timer size={16} />
            <span>Marathon</span>
          </button>
          <button
            onClick={() => onModeChange('matching')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all flex items-center gap-1 ${
              currentMode === 'matching'
                ? 'bg-physics-indigo/80 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Puzzle size={16} />
            <span>Matching</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
