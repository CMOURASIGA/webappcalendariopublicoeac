import React, { useMemo } from 'react';

export type Evento = {
  dia: number;
  diaSemana: string;
  titulo: string;
  tipo: string;
  horario?: string;
};

type Props = {
  mes: string;
  ano: number;
  eventos: Evento[];
};

const normalize = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const truncate = (value: string, maxLength: number): string =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 3).trim()}...`;

const EventIcon: React.FC<{ event: Evento }> = ({ event }) => {
  const source = normalize(`${event.tipo} ${event.titulo}`);

  if (source.includes('cantina')) {
    return (
      <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M10 38h44M15 38c1-10 8-15 17-15s16 5 17 15M14 45h36l-4 8H18z" />
        <path d="M20 18h25l-3-7M39 11l5-5" />
      </svg>
    );
  }

  if (source.includes('reuniao') || source.includes('reunião')) {
    return (
      <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="18" cy="35" r="7" /><circle cx="46" cy="35" r="7" /><circle cx="32" cy="29" r="8" />
        <path d="M7 55c1-9 5-13 11-13M57 55c-1-9-5-13-11-13M19 56c1-12 5-18 13-18s12 6 13 18" />
        <path d="M17 8h30v13H31l-7 6 2-6h-9z" />
      </svg>
    );
  }

  if (source.includes('prepar') || source.includes('montagem')) {
    return (
      <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M9 12h17v17H9zM38 9h17v17H38zM12 38h17v17H12zM36 36h19v19H36z" />
        <path d="M17 12v-5M26 20h6M38 17h-6M21 38v-6M36 45h-7" />
      </svg>
    );
  }

  if (source.includes('pos') || source.includes('social') || source.includes('encontro')) {
    return (
      <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M13 36l27-15v25L13 36zM40 25l10-8v32l-10-8M13 36l-3 13h11l5-10" />
        <path d="M51 11l4-5M54 26h7M52 55l5 4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M32 7l7 16 18 2-13 12 4 18-16-9-16 9 4-18L7 25l18-2z" />
    </svg>
  );
};

const AgendaMensalShareEnhanced: React.FC<Props> = ({ mes, ano, eventos }) => {
  const sortedEvents = useMemo(() => {
    return [...eventos].sort((a, b) => {
      if (a.dia !== b.dia) return a.dia - b.dia;
      return (a.horario ?? '').localeCompare(b.horario ?? '', 'pt-BR');
    });
  }, [eventos]);

  const compact = sortedEvents.length >= 9;

  return (
    <section
      className="relative w-[1080px] overflow-hidden bg-[#faf9f5] font-sans text-[#082a60]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-36 h-96 w-64 rotate-[-12deg] rounded-[48%] bg-[#b9e509]" />
        <div className="absolute -right-28 -top-20 h-80 w-72 rotate-12 rounded-[44%] bg-[#1269dd]" />
        <div className="absolute right-8 top-[410px] grid grid-cols-3 gap-3 opacity-60">
          {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-3 w-3 rounded-full bg-[#1269dd]" />)}
        </div>
        <div className="absolute left-28 top-60 rotate-[-15deg] text-[76px] font-black text-[#0b3e91]">→</div>
        <div className="absolute left-[350px] top-12 rotate-[-12deg] text-[68px] text-[#0b3e91]">☆</div>
        <div className="absolute left-[515px] top-12 text-[80px] text-[#f3bd19]">♕</div>
        <div className="absolute right-16 top-[330px] rotate-12 text-[52px] font-black text-[#f08a19]">///</div>
        <div className="absolute left-[170px] top-[345px] rotate-[-9deg] text-[56px] font-black text-[#0b3e91]">×</div>
      </div>

      <header className="relative z-10 px-12 pb-8 pt-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <img
              src="/assets/eac/logo-eac.png"
              alt="Logo EAC"
              className="h-32 w-32 object-contain drop-shadow-sm"
            />
            <div>
              <p className="text-[48px] font-black leading-none">EAC</p>
              <p className="mt-2 text-[20px] font-black uppercase leading-[1.05]">Porciúncula<br />de Sant&apos;Anna</p>
            </div>
          </div>
          <div className="mt-4 rotate-[-5deg] rounded-[22px] bg-[#f5c43d] px-7 py-4 shadow-lg">
            <p className="text-[21px] font-black uppercase leading-tight">Vive o EAC!<br />Faz acontecer!</p>
          </div>
        </div>

        <div className="mt-1 text-center">
          <h1
            className="rotate-[-3deg] text-[102px] font-black uppercase italic leading-none tracking-[-0.08em]"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: '4px 4px 0 rgba(8,42,96,0.10)',
            }}
          >
            Agenda EAC
          </h1>
          <div
            className="mx-auto mt-[-2px] inline-flex rotate-[-2deg] px-20 py-4 shadow-xl"
            style={{ background: 'linear-gradient(175deg, #1269dd 0%, #084ba8 100%)' }}
          >
            <p className="text-[62px] font-black uppercase italic leading-none text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              {mes} <span className="text-[#b9e509]">{ano}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-8 pb-7 pt-10">
        <div className={`grid grid-cols-2 ${compact ? 'gap-4' : 'gap-5'}`}>
          {sortedEvents.length === 0 ? (
            <div className="col-span-2 rounded-[34px] bg-white p-14 text-center shadow-xl">
              <p className="text-[34px] font-black uppercase">Sem eventos neste mês</p>
            </div>
          ) : sortedEvents.map((evento, index) => (
            <article
              key={`${evento.dia}-${evento.titulo}-${evento.horario ?? ''}-${index}`}
              className={`${compact ? 'min-h-[180px] p-4' : 'min-h-[220px] p-5'} flex items-stretch rounded-[30px] border border-slate-200 bg-white shadow-[0_14px_28px_rgba(8,42,96,0.14)] ${
                sortedEvents.length % 2 === 1 && index === sortedEvents.length - 1 ? 'col-span-2 w-[49%]' : ''
              }`}
            >
              <div className="flex w-[112px] shrink-0 items-center justify-center rounded-[22px] bg-[#e41526] text-white shadow-md">
                <EventIcon event={evento} />
              </div>

              <div className="ml-4 flex w-[92px] shrink-0 flex-col items-center justify-center border-r border-slate-200 pr-4">
                <span className={`${compact ? 'text-[48px]' : 'text-[58px]'} font-black leading-none text-[#e41526]`}>
                  {String(evento.dia).padStart(2, '0')}
                </span>
                <span className="mt-2 text-[20px] font-black uppercase text-[#e41526]">
                  {evento.diaSemana.replace('.', '')}
                </span>
              </div>

              <div className="min-w-0 flex-1 py-2 pl-5">
                <h2 className={`${compact ? 'text-[22px]' : 'text-[27px]'} font-black uppercase leading-[1.02]`}>
                  {truncate(evento.titulo, compact ? 30 : 38)}
                </h2>
                <p className="mt-3 text-[17px] font-bold text-slate-600">◷ {evento.horario || 'Horário a definir'}</p>
                <span className="mt-4 inline-flex rounded-full bg-[#e41526] px-4 py-1.5 text-[14px] font-black uppercase tracking-[0.05em] text-white">
                  {truncate(evento.tipo, 20)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="relative z-10 mt-1 h-[510px] overflow-hidden">
        <div className="absolute bottom-36 left-8 w-[610px] rotate-[-3deg] skew-x-[-3deg] bg-[#082a60] px-10 py-8 shadow-xl">
          <div className="skew-x-[3deg]">
            <p className="text-[30px] font-black uppercase leading-tight text-white">Não fique de fora!</p>
            <p className="mt-1 text-[34px] font-black uppercase leading-[1.06] text-[#b9e509]">Marque na agenda<br />e chame a galera!</p>
          </div>
        </div>

        <div className="absolute bottom-10 left-12">
          <p className="text-[25px] font-black uppercase italic">Siga nossas redes!</p>
          <p className="mt-2 text-[23px] font-black">◎ ◉ &nbsp; @EAC.PORCIUNCULA</p>
        </div>

        <img
          src="/assets/eac/menina-eac.png"
          alt="Personagem EAC"
          className="pointer-events-none absolute bottom-0 right-[-12px] h-[515px] w-auto object-contain drop-shadow-[0_18px_30px_rgba(8,42,96,0.24)]"
        />
      </footer>
    </section>
  );
};

export default AgendaMensalShareEnhanced;
