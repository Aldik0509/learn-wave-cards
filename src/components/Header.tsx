
import { useState } from 'react';
import { Timer } from 'lucide-react';

interface HeaderProps {
  onModeChange: (mode: 'learn' | 'test' | 'marathon') => void;
  currentMode: 'learn' | 'test' | 'marathon';
}

const Header = ({ onModeChange, currentMode }: HeaderProps) => {
  return (
    <header className="pt-6 pb-4 mb-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-gradient">
          Физика: Основы волн
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Интерактивные карточки для учеников 7-11 классов
        </p>
        
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
