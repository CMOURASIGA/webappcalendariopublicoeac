import React from 'react';
import { EVENT_DOT_COLORS, EVENT_TYPE_LABELS, EventType } from '../types';

const LEGEND_DESCRIPTIONS: Record<EventType, string> = {
  'Encontro': 'Atividades principais de encontro do EAC.',
  'Cantina': 'Escalas, preparos e atividades da cantina.',
  'Circulo': 'Reuniões e vivências de círculos.',
  'Pós-Encontro': 'Ações e compromissos do pós-encontro.',
  'Missa': 'Celebrações eucarísticas.',
  'Preparação Encontro': 'Preparativos para encontros e eventos do EAC.',
  'Reunião': 'Reuniões de organização, coordenação e apoio.',
  'Tempo Litúrgico': 'Marcos e períodos litúrgicos (Advento, Quaresma, Tempo Pascal e Tempo Comum).',
  'Solenidade': 'Grandes datas litúrgicas (Páscoa, Pentecostes, Corpus Christi, Natal, etc.).',
  'Festa de Santos': 'Celebrações relacionadas a santos.',
  'Datas Marianas': 'Celebrações relacionadas a Nossa Senhora.',
  'Outro': 'Eventos pastorais que não se enquadram nas categorias anteriores.',
};

const EVENT_ORDER: EventType[] = [
  'Encontro',
  'Cantina',
  'Circulo',
  'Pós-Encontro',
  'Missa',
  'Preparação Encontro',
  'Reunião',
  'Tempo Litúrgico',
  'Solenidade',
  'Festa de Santos',
  'Datas Marianas',
  'Outro',
];

const HelpModal: React.FC = () => {
  return (
    <section className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-[#112760] text-white p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.12em]">Ajuda do Calendário</h2>
        <p className="text-xs md:text-sm opacity-80 mt-1">Orientações de uso e significado das legendas</p>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-black uppercase tracking-[0.12em] text-[#112760] mb-3">Objetivo</h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Este calendário apresenta os eventos públicos do EAC e referências do calendário litúrgico,
            facilitando a organização da comunidade.
          </p>
        </section>

        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-black uppercase tracking-[0.12em] text-[#112760] mb-4">Como Usar</h3>
          <div className="space-y-3 text-sm md:text-base text-slate-600">
            <p>1. Escolha o ano e o mês no topo da página.</p>
            <p>2. Use `Grade` para visão mensal e `Lista` para visão detalhada.</p>
            <p>3. Clique em um dia (ou em `Ver Detalhes`) para abrir os eventos.</p>
            <p>4. Use os chips de legenda para filtrar categorias específicas.</p>
            <p>5. Use `Atualizar agora` para sincronizar imediatamente.</p>
          </div>
        </section>

        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6">
          <h3 className="text-sm md:text-base font-black uppercase tracking-[0.12em] text-[#112760] mb-4">Legendas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EVENT_ORDER.map((type) => (
              <div key={type} className="bg-white border border-slate-100 rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${EVENT_DOT_COLORS[type]} ring-2 ring-slate-50`}></span>
                  <span className="text-xs md:text-sm font-black uppercase tracking-[0.08em] text-slate-700">
                    {EVENT_TYPE_LABELS[type]}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{LEGEND_DESCRIPTIONS[type]}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default HelpModal;
