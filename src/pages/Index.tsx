import { useState } from 'react';
import Header from '@/components/Header';
import LearnMode from '@/components/LearnMode';
import TestMode from '@/components/TestMode';
import MarathonMode from '@/components/MarathonMode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlashCardData } from '@/components/FlashCard';

const flashCardsData: (FlashCardData & { grade: number })[] = [
  {
    id: 1,
    grade: 7,
    question: "Что такое механические волны?",
    answer: "Механические колебания, распространяющиеся в пространстве с течением времени.",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    grade: 7,
    question: "Какие существуют типы волн по направлению колебаний?",
    answer: "Продольные и поперечные волны.",
  },
  {
    id: 3,
    grade: 7,
    question: "Что такое частота колебаний?",
    answer: "Число полных колебаний, совершаемых за 1 секунду. Измеряется в герцах (Гц).",
  },
  {
    id: 4,
    grade: 7,
    question: "Как обозначается период колебаний?",
    answer: "Буквой T. Это время одного полного колебания.",
  },
  {
    id: 5,
    grade: 7,
    question: "Что такое амплитуда колебаний?",
    answer: "Максимальное отклонение колеблющегося тела от положения равновесия.",
  },
  {
    id: 6,
    grade: 8,
    question: "Что такое длина волны?",
    answer: "Расстояние между двумя ближайшими точками, колеблющимися в одинаковых фазах.",
  },
  {
    id: 7,
    grade: 8,
    question: "Как связаны длина волны, скорость и частота?",
    answer: "λ = v/ν, где λ - длина волны, v - скорость волны, ν - частота.",
  },
  {
    id: 8,
    grade: 8,
    question: "Что такое поперечная волна?",
    answer: "Волна, в которой частицы среды колеблются перпендикулярно направлению распространения волны.",
    image: "https://images.unsplash.com/photo-1673847627014-c871fbf265f0?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    grade: 8,
    question: "Что такое продольная волна?",
    answer: "Волна, в которой частицы среды колеблются вдоль направления распространения волны.",
  },
  {
    id: 10,
    grade: 8,
    question: "Формула связи периода и частоты колебаний?",
    answer: "T = 1/ν, где T - период, ν - частота.",
  },
  {
    id: 11,
    grade: 9,
    question: "Что такое звуковые волны?",
    answer: "Механические продольные волны с частотой от 16 Гц до 20 кГц, воспринимаемые человеческим ухом.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 12,
    grade: 9,
    question: "Когда возникает явление резонанса?",
    answer: "Когда частота внешней силы совпадает с собственной частотой колебаний системы.",
  },
  {
    id: 13,
    grade: 9,
    question: "Формула скорости звука в газах?",
    answer: "v = √(γRT/M), где γ - показатель адиабаты, R - газовая постоянная, T - температура, M - молярная масса.",
  },
  {
    id: 14,
    grade: 9,
    question: "Что такое инфразвук?",
    answer: "Звуковые волны с частотой менее 16 Гц, не воспринимаемые человеческим ухом.",
  },
  {
    id: 15,
    grade: 9,
    question: "Что такое ультразвук?",
    answer: "Звуковые волны с частотой более 20 кГц, не воспринимаемые человеческим ухом.",
  },
  {
    id: 16,
    grade: 10,
    question: "Что такое электромагнитные волны?",
    answer: "Распространяющееся в пространстве возмущение электромагнитного поля.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 17,
    grade: 10,
    question: "Какова скорость распространения электромагнитных волн в вакууме?",
    answer: "300 000 км/с (скорость света).",
  },
  {
    id: 18,
    grade: 10,
    question: "Формула связи длины волны и частоты электромагнитных колебаний?",
    answer: "c = λν, где c - скорость света, λ - длина волны, ν - частота.",
  },
  {
    id: 19,
    grade: 10,
    question: "Что ��акое радиоволны?",
    answer: "Электромагнитные волны с длиной волны от 1 мм до нескольких километров.",
  },
  {
    id: 20,
    grade: 10,
    question: "Формула энергии фотона?",
    answer: "E = hν, где h - постоянная Планка, ν - частота.",
  },
  {
    id: 21,
    grade: 11,
    question: "Что такое дифракция волны?",
    answer: "Явление огибания волной препятствий, соизмеримых с длиной волны.",
  },
  {
    id: 22,
    grade: 11,
    question: "Что такое интерференция волн?",
    answer: "Явление наложения волн, при котором происходит усиление или ослабление амплитуды результирующей волны.",
  },
  {
    id: 23,
    grade: 11,
    question: "Условие максимума интерференции?",
    answer: "Δd = kλ, где k = 0, ±1, ±2, ...; λ - длина волны; Δd - разность хода волн.",
  },
  {
    id: 24,
    grade: 11,
    question: "Условие минимума интерференции?",
    answer: "Δd = (2k+1)λ/2, где k = 0, ±1, ±2, ...; λ - длина волны; Δd - разность хода волн.",
  },
  {
    id: 25,
    grade: 11,
    question: "Что такое поляризация волн?",
    answer: "Явление упорядочения колебаний в электромагнитной волне в одной плоскости.",
  }
];

const Index = () => {
  const [mode, setMode] = useState<'learn' | 'test' | 'marathon'>('learn');
  const [selectedGrade, setSelectedGrade] = useState<string>("7");

  const handleModeChange = (newMode: 'learn' | 'test' | 'marathon') => {
    setMode(newMode);
  };

  const filteredCards = flashCardsData.filter(
    card => card.grade === parseInt(selectedGrade)
  );

  return (
    <div className="min-h-screen py-6">
      <Header onModeChange={handleModeChange} currentMode={mode} />
      
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
          <p>© 2025 Физика: Основы волн | Интерактивные образовательные карточки для 7-11 классов</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
