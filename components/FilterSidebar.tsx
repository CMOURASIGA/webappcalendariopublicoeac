
import React from 'react';
import { EventType, EVENT_DOT_COLORS, EVENT_TYPE_LABELS } from '../types';

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
  'Preparação Encontro',
  'Reunião',
  'Outro'
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  selectedTypes, 
  onToggleType,
  onClearFilters 
}) => {
  return (
    <div className="bg-white rounded-[32px] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-[#112760] text-xs uppercase tracking-[0.2em]">Categorias</h3>
        <button 
          onClick={onClearFilters}
          className="text-[10px] text-blue-600 hover:text-blue-800 font-black uppercase tracking-tighter"
        >
          Limpar
        </button>
      </div>
      
      <div className="space-y-3">
        {ALL_TYPES.map((type) => (
          <button 
            key={type} 
            onClick={() => onToggleType(type)}
            className={`w-full flex items-center p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
              selectedTypes.has(type) 
                ? 'border-[#112760] bg-blue-50/50 shadow-sm' 
                : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
            }`}
          >
            <span className={`w-3 h-3 rounded-full mr-4 ${EVENT_DOT_COLORS[type]} shadow-sm ring-2 ring-white`}></span>
            <span className={`text-[11px] font-black uppercase tracking-widest ${selectedTypes.has(type) ? 'text-[#112760]' : 'text-slate-400'}`}>
              {EVENT_TYPE_LABELS[type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
