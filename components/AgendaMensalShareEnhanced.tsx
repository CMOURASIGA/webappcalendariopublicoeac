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

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const EventIcon: React.FC<{ event: Evento }> = ({ event }) => {
  const source = normalize(`${event.tipo} ${event.titulo}`);
  const common = 'h-[82px] w-[82px]';

  if (source.includes('cantina')) {
    return (
      <svg viewBox="0 0 80 80" className={common} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 43h44M17 43c1-13 10-20 22-20s21 7 22 20M16 51h46l-6 11H22z" />
        <path d="M25 17h31l-4-9M48 9l5-5M22 35h4M33 31h4M45 35h4" />
      </svg>
    );
  }

  if (source.includes('reuniao') || source.includes('equipe')) {
    return (
      <svg viewBox="0 0 80 80" className={common} fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="23" cy="43" r="8" /><circle cx="57" cy="43" r="8" /><circle cx="40" cy="35" r="10" />
        <path d="M8 68c2-11 7-17 15-17M72 68c-2-11-7-17-15-17M23 69c2-16 8-24 17-24s15 8 17 24" />
        <path d="M20 8h40v15H41l-10 8 3-8H20z" />
      </svg>
    );
  }

  if (source.includes('prepar') || source.includes('montagem')) {
    return (
      <svg viewBox="0 0 80 80" className={common} fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13h22v22H10zM48 10h22v22H48zM13 48h22v22H13zM45 45h25v25H45z" />
        <path d="M21 13V6M32 24h8M48 21h-8M24 48v-8M45 57H35" />
      </svg>
    );
  }

  if (source.includes('pos') || source.includes('social') || source.includes('encontro')) {
    return (
      <svg viewBox="0 0 80 80" className={common} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 45l36-20v38L13 45zM49 31l14-11v43L49 52M13 45L9 64h14l7-15" />
        <path d="M64 12l6-7M68 36h9M65 70l7 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className={common} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 9l9 20 22 3-16 15 5 22-20-11-20 11 5-22L9 32l22-3z" />
    </svg>
  );
};

const Doodles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg className="absolute left-7 top-[420px] h-28 w-28 -rotate-12 text-[#0b4a88]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <path d="M12 49c18-24 40-29 67-19M63 15l17 15-18 14" />
      <path d="M15 67c18 10 37 12 58 4" strokeDasharray="4 10" />
    </svg>
    <svg className="absolute right-9 top-[405px] h-24 w-24 rotate-12 text-[#f59e0b]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <path d="M50 9l8 24 25-8-17 20 20 15-26-2-2 27-10-24-23 13 14-22-24-11 26-2z" />
    </svg>
    <div className="absolute left-[410px] top-[445px] rotate-6 rounded-full border-[7px] border-[#a3e635] px-5 py-2 font-black text-[#0b2545]">BORA?</div>
    <div className="absolute right-10 top-[520px] grid grid-cols-4 gap-3 opacity-60">
      {Array.from({ length: 12 }).map((_, index) => <span key={index} className="h-3 w-3 rounded-full bg-[#0b4a88]" />)}
    </div>
  </div>
);

const AgendaMensalShareEnhanced: React.FC<Props> = ({ mes, ano, eventos }) => {
  const sortedEvents = useMemo(() => [...eventos].sort((a, b) => {
    if (a.dia !== b.dia) return a.dia - b.dia;
    return (a.horario ?? '').localeCompare(b.horario ?? '', 'pt-BR');
  }), [eventos]);

  const visibleEvents = sortedEvents.slice(0, 8);
  const compact = visibleEvents.length > 4;

  return (
    <section
      className="relative w-[1080px] overflow-hidden font-sans text-[#0b2545]"
      style={{
        backgroundColor: '#d9b784',
        backgroundImage: [
          'radial-gradient(circle at 20% 30%, rgba(91,57,26,.18) 0 1px, transparent 1.8px)',
          'radial-gradient(circle at 80% 60%, rgba(255,255,255,.25) 0 1px, transparent 2px)',
          'linear-gradient(105deg, rgba(255,255,255,.08), transparent 35%, rgba(80,45,18,.08))',
        ].join(','),
        backgroundSize: '17px 19px, 23px 27px, 100% 100%',
      }}
    >
      <Doodles />

      <div className="absolute -left-8 top-24 h-[410px] w-[760px] -rotate-3 bg-[#f7f1e7] shadow-[0_14px_28px_rgba(73,42,18,.18)]" />
      <div className="absolute right-[-70px] top-[-35px] h-[430px] w-[420px] rotate-6 bg-[#f3eadb] shadow-[0_14px_28px_rgba(73,42,18,.15)]" />

      <header className="relative z-10 px-12 pb-10 pt-10">
        <div className="flex items-start justify-between">
          <div className="relative rotate-[-3deg]">
            <span className="absolute -top-3 left-12 h-8 w-24 rotate-6 bg-[#f5c85b]/80 shadow-sm" />
            <div className="flex items-center gap-4 bg-white/70 p-3 pr-6 shadow-md">
              <img src="/assets/eac/logo-oficial-imgur.jpg" alt="Logo EAC" className="h-32 w-32 rounded-full object-cover" />
              <div>
                <p className="text-[43px] font-black leading-none text-[#0b4a88]">EAC</p>
                <p className="mt-1 text-[18px] font-black uppercase leading-[1.05]">Porciúncula<br />de Sant&apos;Anna</p>
              </div>
            </div>
          </div>

          <div className="relative mt-5 rotate-3">
            <span className="absolute -left-5 -top-4 h-9 w-24 -rotate-12 bg-[#70d6ff]/75" />
            <div className="rounded-[45%_55%_48%_52%] bg-[#facc15] px-8 py-5 shadow-[5px_7px_0_rgba(11,37,69,.18)]">
              <p className="text-[22px] font-black uppercase leading-tight">Vive o EAC!<br />Faz acontecer!</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-[-2px] w-[790px] text-center">
          <svg className="absolute -left-4 top-0 h-44 w-[820px]" viewBox="0 0 820 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M10 77C91 39 173 61 249 38c115-35 216 23 320-2 91-22 165 8 237 31l-14 82c-129-15-231 17-353-2-131-21-247 24-415-3z" fill="#0b4a88" />
            <path d="M46 137c120-21 252 17 374-1 111-16 214 9 344-11" fill="none" stroke="#a3e635" strokeWidth="16" strokeLinecap="round" />
          </svg>
          <h1
            className="relative z-10 pt-7 text-[96px] font-black uppercase italic leading-none tracking-[-0.07em] text-white"
            style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: '5px 5px 0 #071a32' }}
          >
            Agenda EAC
          </h1>
          <div className="relative z-20 mx-auto mt-0 inline-block -rotate-2 bg-[#111827] px-16 py-3 shadow-lg">
            <p className="text-[54px] font-black uppercase italic leading-none text-white" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              {mes} <span className="text-[#a3e635]">{ano}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-20 px-11 pb-12 pt-12">
        <div className={`grid grid-cols-2 ${compact ? 'gap-x-7 gap-y-8' : 'gap-x-9 gap-y-10'}`}>
          {visibleEvents.length === 0 ? (
            <div className="relative col-span-2 mx-20 rotate-[-1deg] bg-[#fffdf8] p-16 text-center shadow-[0_14px_28px_rgba(73,42,18,.25)]">
              <span className="absolute -top-5 left-[42%] h-10 w-40 rotate-2 bg-[#facc15]/75" />
              <p className="text-[35px] font-black uppercase">Ainda não há eventos publicados neste mês</p>
            </div>
          ) : visibleEvents.map((evento, index) => {
            const rotation = [-1.8, 1.3, 0.9, -1.2, -0.7, 1.7, 1.1, -1.5][index];
            const tapeColors = ['#facc15aa', '#70d6ffaa', '#a3e635aa', '#f6a6b2aa'];

            return (
              <article
                key={`${evento.dia}-${evento.titulo}-${evento.horario ?? ''}-${index}`}
                className={`${compact ? 'min-h-[218px]' : 'min-h-[252px]'} relative flex bg-[#fffdf8] p-5 shadow-[0_16px_24px_rgba(73,42,18,.26)]`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <span
                  className="absolute -top-5 left-[37%] z-30 h-10 w-32 shadow-sm"
                  style={{ backgroundColor: tapeColors[index % tapeColors.length], transform: `rotate(${index % 2 ? -4 : 4}deg)` }}
                />
                <span className="absolute right-5 top-4 h-4 w-4 rounded-full bg-[#dc2626] shadow-[2px_3px_3px_rgba(0,0,0,.35)]" />

                <div className="flex w-[120px] shrink-0 items-center justify-center rounded-sm bg-[#dc2626] text-white shadow-inner">
                  <EventIcon event={evento} />
                </div>
                <div className="ml-4 flex w-[92px] shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-[#d7c9b5] pr-4">
                  <span className="text-[56px] font-black leading-none text-[#dc2626]">{String(evento.dia).padStart(2, '0')}</span>
                  <span className="mt-2 text-[20px] font-black uppercase text-[#dc2626]">{evento.diaSemana.replace('.', '')}</span>
                </div>
                <div className="min-w-0 flex-1 py-2 pl-5">
                  <h2 className={`${compact ? 'text-[22px]' : 'text-[27px]'} font-black uppercase leading-[1.02]`}>
                    {truncate(evento.titulo, compact ? 28 : 36)}
                  </h2>
                  <p className="mt-3 text-[17px] font-bold text-slate-600">◷ {evento.horario || 'Horário a definir'}</p>
                  <span className="mt-4 inline-flex -rotate-1 bg-[#dc2626] px-4 py-1.5 text-[14px] font-black uppercase tracking-[0.04em] text-white">
                    {truncate(evento.tipo, 19)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {sortedEvents.length > 8 && (
          <div className="mx-auto mt-9 w-fit rotate-1 bg-[#facc15] px-6 py-3 text-[18px] font-black uppercase shadow-md">
            + {sortedEvents.length - 8} eventos, consulte o calendário completo
          </div>
        )}
      </main>

      <footer className="relative z-10 mt-1 h-[500px] overflow-hidden">
        <svg className="absolute bottom-0 left-0 h-[500px] w-full" viewBox="0 0 1080 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 177c123-67 244-7 364-58 166-71 318 31 461-38 96-46 175-30 255-10v429H0z" fill="#0b4a88" />
          <path d="M0 239c126-38 228 15 357-20" fill="none" stroke="#a3e635" strokeWidth="22" strokeLinecap="round" />
          <path d="M49 142c37-30 67-35 105-15M119 99l38 27-38 24" fill="none" stroke="#facc15" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="absolute bottom-[178px] left-10 w-[590px] -rotate-3 bg-[#101827] px-10 py-7 shadow-[8px_10px_0_rgba(163,230,53,.9)]">
          <p className="text-[31px] font-black uppercase leading-tight text-white">Não fique de fora!</p>
          <p className="mt-1 text-[36px] font-black uppercase leading-[1.04] text-[#facc15]">Marque na agenda<br />e chame a galera!</p>
        </div>

        <div className="absolute bottom-12 left-12 text-white">
          <p className="text-[20px] font-black uppercase tracking-[0.13em] text-[#a3e635]">Acompanhe o EAC</p>
          <div className="mt-2 flex items-center gap-3">
            <InstagramIcon />
            <p className="text-[24px] font-black">@eacporciunculadesantana</p>
          </div>
        </div>

        <img
          src="/assets/eac/menina-eac.png"
          alt="Personagem EAC"
          className="pointer-events-none absolute bottom-0 right-[-18px] h-[500px] w-auto object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,.3)]"
        />
      </footer>
    </section>
  );
};

export default AgendaMensalShareEnhanced;
