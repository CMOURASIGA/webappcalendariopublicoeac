
import React from 'react';
import { EventType, EVENT_DOT_COLORS } from '../types';

interface FilterSidebarProps {
  selectedTypes: Set<EventType>;
  onToggleType: (type: EventType) => void;
  onClearFilters: () => void;
}

const ALL_TYPES: EventType[] = [
  'Encontro',
  'Cantina',
  'Circulo',
  'Pós-Encontro',
  'Missa',
  'Preparação Encontro'
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  selectedTypes, 
  onToggleType,
  onClearFilters 
}) => {
  return (
    <div className="bg-white rounded-[20px] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-[#1e293b] text-sm uppercase tracking-widest">Tags de Filtro</h3>
        <button 
          onClick={onClearFilters}
          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold uppercase tracking-tighter"
        >
          Limpar Tudo
        </button>
      </div>
      
      <div className="space-y-4">
        {ALL_TYPES.map((type) => (
          <button 
            key={type} 
            onClick={() => onToggleType(type)}
            className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
              selectedTypes.has(type) 
                ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500' 
                : 'border-gray-50 hover:border-gray-200 bg-gray-50/50'
            }`}
          >
            <span className={`w-3 h-3 rounded-full mr-4 ${EVENT_DOT_COLORS[type]} shadow-sm`}></span>
            <span className={`text-[11px] font-black uppercase tracking-wider ${selectedTypes.has(type) ? 'text-blue-900' : 'text-gray-500'}`}>
              {type}
            </span>
            {selectedTypes.has(type) && (
              <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">
          Selecione os módulos de<br/>interesse para filtrar a agenda
        </p>
      </div>
    </div>
  );
};

export default FilterSidebar;
