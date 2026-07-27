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

const LOGO_EAC_URL = 'https://imgur.com/c5XQ7TW.png';

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
      style={{ minHeight: '1536px' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-36 h-96 w-64 rotate-[-12deg] rounded-[48%] bg-[#b9e509]" />
        <div className="absolute -right-28 -top-20 h-80 w-72 rotate-12 rounded-[44%] bg-[#1269dd]" />
        <div className="absolute right-8 top-[410px] grid grid-cols-3 gap-3 opacity-60">
          {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-3 w-3 rounded-full bg-[#1269dd]" />)}
        </div>
        <div className="absolute left-28 top-56 rotate-[-15deg] text-[70px] font-black text-[#0b3e91]">→</div>
        <div className="absolute left-[355px] top-16 rotate-[-12deg] text-[64px] text-[#0b3e91]">☆</div>
        <div className="absolute left-[500px] top-16 text-[76px] text-[#f3bd19]">♕</div>
      </div>

      <header className="relative z-10 px-12 pb-8 pt-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <img
              src={LOGO_EAC_URL}
              crossOrigin="anonymous"
              alt="Logo EAC"
              className="h-28 w-28 object-contain"
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

        <div className="mt-3 text-center">
          <h1
            className="rotate-[-2deg] text-[92px] font-black uppercase italic leading-none tracking-[-0.07em]"
            style={{ textShadow: '3px 3px 0 rgba(8,42,96,0.08)' }}
          >
            Agenda EAC
          </h1>
          <div className="mx-auto mt-1 inline-flex rotate-[-2deg] bg-[#1269dd] px-16 py-3 shadow-xl">
            <p className="text-[58px] font-black uppercase italic leading-none text-white">
              {mes} <span className="text-[#b9e509]">{ano}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-8 pb-8 pt-8">
        <div className={`grid grid-cols-2 ${compact ? 'gap-4' : 'gap-5'}`}>
          {sortedEvents.length === 0 ? (
            <div className="col-span-2 rounded-[34px] bg-white p-14 text-center shadow-xl">
              <p className="text-[34px] font-black uppercase">Sem eventos neste mês</p>
            </div>
          ) : sortedEvents.map((evento, index) => (
            <article
              key={`${evento.dia}-${evento.titulo}-${evento.horario ?? ''}-${index}`}
              className={`${compact ? 'min-h-[180px] p-4' : 'min-h-[210px] p-5'} flex items-stretch rounded-[30px] border border-slate-200 bg-white shadow-[0_14px_28px_rgba(8,42,96,0.14)] ${
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

      <footer className="relative z-10 mt-3 h-[390px] overflow-hidden">
        <div className="absolute bottom-28 left-8 w-[570px] rotate-[-3deg] bg-[#082a60] px-9 py-7 shadow-xl">
          <p className="text-[28px] font-black uppercase leading-tight text-white">Não fique de fora!</p>
          <p className="mt-1 text-[31px] font-black uppercase leading-[1.06] text-[#b9e509]">Marque na agenda<br />e chame a galera!</p>
        </div>

        <div className="absolute bottom-8 left-12">
          <p className="text-[23px] font-black uppercase">Siga nossas redes!</p>
          <p className="mt-2 text-[21px] font-black">◎ ◉ &nbsp; @EAC.PORCIUNCULA</p>
        </div>

        <img
          src="/assets/eac/menina-eac.png"
          alt="Personagem EAC"
          className="pointer-events-none absolute bottom-0 right-0 h-[390px] w-auto object-contain drop-shadow-[0_18px_30px_rgba(8,42,96,0.24)]"
        />
      </footer>
    </section>
  );
};

export default AgendaMensalShareEnhanced;
