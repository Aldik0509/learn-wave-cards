
import { useState } from 'react';
import { Timer } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface HeaderProps {
  onModeChange: (mode: 'learn' | 'test' | 'marathon') => void;
  currentMode: 'learn' | 'test' | 'marathon';
  onSubjectChange: (subject: 'physics' | 'algebra' | 'geometry') => void;
  currentSubject: 'physics' | 'algebra' | 'geometry';
}

const Header = ({ onModeChange, currentMode, onSubjectChange, currentSubject }: HeaderProps) => {
  return (
    <header className="pt-6 pb-4 mb-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-gradient">
          {currentSubject === 'physics' && 'Физика: Основы волн'}
          {currentSubject === 'algebra' && 'Алгебра: Основные понятия'}
          {currentSubject === 'geometry' && 'Геометрия: Ключевые фигуры'}
        </h1>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Интерактивные карточки для учеников 7-11 классов
        </p>
        
        <div className="flex justify-center mb-6">
          <ToggleGroup type="single" value={currentSubject} onValueChange={(value) => value && onSubjectChange(value as 'physics' | 'algebra' | 'geometry')}>
            <ToggleGroupItem value="physics" className={`px-4 py-2 ${currentSubject === 'physics' ? 'bg-physics-indigo text-white' : 'bg-white/80'}`}>
              Физика
            </ToggleGroupItem>
            <ToggleGroupItem value="algebra" className={`px-4 py-2 ${currentSubject === 'algebra' ? 'bg-physics-purple text-white' : 'bg-white/80'}`}>
              Алгебра
            </ToggleGroupItem>
            <ToggleGroupItem value="geometry" className={`px-4 py-2 ${currentSubject === 'geometry' ? 'bg-physics-cyan text-white' : 'bg-white/80'}`}>
              Геометрия
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
            Изучение
          </button>
          <button
            onClick={() => onModeChange('test')}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
              currentMode === 'test'
                ? 'bg-physics-purple text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Тест
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
            <span>Марафон</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
