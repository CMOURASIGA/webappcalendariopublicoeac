import React, { useMemo } from 'react';

export type Evento = {
  dia: number;
  diaSemana: string;
  titulo: string;
  tipo: string;
  horario?: string;
};

type Props = { mes: string; ano: number; eventos: Evento[] };

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 3).trim()}...`;

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.3">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const EventIcon: React.FC<{ event: Evento }> = ({ event }) => {
  const source = normalize(`${event.tipo} ${event.titulo}`);
  const props = {
    viewBox: '0 0 80 80',
    className: 'h-[78px] w-[78px]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (source.includes('cantina')) return (
    <svg {...props}><path d="M12 42h48M17 42c2-13 10-19 22-19s21 6 23 19M16 51h47l-7 12H23zM23 34h4M35 30h4M48 34h4" /><path d="M55 16h13l-4 34M58 16l5-9" /></svg>
  );
  if (source.includes('reuniao') || source.includes('equipe')) return (
    <svg {...props}><circle cx="23" cy="45" r="8" /><circle cx="57" cy="45" r="8" /><circle cx="40" cy="34" r="10" /><path d="M8 69c2-11 7-16 15-16M72 69c-2-11-7-16-15-16M23 69c2-16 8-24 17-24s15 8 17 24M18 8h44v15H42l-11 8 3-8H18z" /></svg>
  );
  if (source.includes('prepar') || source.includes('montagem')) return (
    <svg {...props}><path d="M10 13h23v23H10zM47 10h23v23H47zM13 47h23v23H13zM44 44h26v26H44z" /><path d="M22 13V6M33 24h8M47 22h-8M25 47v-8M44 57h-8" /></svg>
  );
  if (source.includes('pos') || source.includes('social') || source.includes('encontro')) return (
    <svg {...props}><path d="M12 45l37-20v38L12 45zM49 31l14-10v42L49 52M12 45L9 64h15l7-15M65 13l7-7M68 37h9M65 68l8 6" /></svg>
  );
  return <svg {...props}><path d="M40 8l9 21 22 3-16 15 5 23-20-12-20 12 5-23L9 32l22-3z" /></svg>;
};

const DoodleLayer = () => (
  <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" viewBox="0 0 1080 1900" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M31 420c38-42 75-47 126-21m-31-24 33 24-32 29" stroke="#0b4a88" strokeWidth="9" />
      <path d="M894 365l13 31 33-6-25 23 20 27-31-14-16 29 4-34-34-7 32-12z" stroke="#f4b400" strokeWidth="7" />
      <path d="M36 910c29-20 59-20 90 0s61 20 91 0" stroke="#dc2626" strokeWidth="8" />
      <path d="M920 1040c-46 1-73 23-83 65m-8-25 8 27 28-9" stroke="#0b4a88" strokeWidth="8" />
      <path d="M61 1450l23-40 23 40 43 9-35 28 5 45-36-24-38 24 8-45-35-28z" stroke="#84cc16" strokeWidth="8" />
      <path d="M817 1510c27-25 58-31 94-19m-17-25 21 28-31 18" stroke="#f4b400" strokeWidth="8" />
    </g>
    <g fill="#0b4a88" opacity=".72">
      {Array.from({ length: 18 }).map((_, index) => <circle key={index} cx={930 + (index % 6) * 18} cy={620 + Math.floor(index / 6) * 18} r="5" />)}
    </g>
  </svg>
);

const AgendaMensalShareEnhanced: React.FC<Props> = ({ mes, ano, eventos }) => {
  const sortedEvents = useMemo(() => [...eventos].sort((a, b) =>
    a.dia !== b.dia ? a.dia - b.dia : (a.horario ?? '').localeCompare(b.horario ?? '', 'pt-BR')
  ), [eventos]);
  const visibleEvents = sortedEvents.slice(0, 8);
  const compact = visibleEvents.length > 4;

  return (
    <section
      className="relative w-[1080px] overflow-hidden text-[#172033]"
      style={{
        fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
        backgroundColor: '#c99458',
        backgroundImage: [
          'radial-gradient(circle at 12% 18%, rgba(72,38,13,.30) 0 1px, transparent 2px)',
          'radial-gradient(circle at 74% 46%, rgba(255,255,255,.22) 0 1.5px, transparent 2.5px)',
          'linear-gradient(112deg, rgba(255,255,255,.08), transparent 32%, rgba(69,35,12,.11))',
        ].join(','),
        backgroundSize: '15px 17px, 23px 25px, 100% 100%',
      }}
    >
      <DoodleLayer />
      <div className="absolute -left-16 top-20 z-0 h-[405px] w-[740px] -rotate-3 bg-[#f5efe2] shadow-xl" style={{ clipPath: 'polygon(0 3%,100% 0,98% 91%,89% 96%,77% 92%,64% 98%,50% 93%,36% 99%,22% 94%,8% 98%)' }} />
      <div className="absolute -right-14 top-[-24px] z-0 h-[355px] w-[420px] rotate-6 bg-[#d8e6ea] shadow-lg" style={{ backgroundImage: 'linear-gradient(#bdd0d6 1px,transparent 1px),linear-gradient(90deg,#bdd0d6 1px,transparent 1px)', backgroundSize: '24px 24px' }} />

      <header className="relative z-10 min-h-[470px] px-12 pt-9">
        <div className="absolute left-10 top-8 -rotate-3">
          <span className="absolute -top-4 left-20 z-20 h-9 w-28 rotate-6 bg-[#f3c45f]/80 shadow" />
          <div className="relative flex items-center gap-4 bg-white/90 p-4 pr-7 shadow-[0_14px_25px_rgba(74,38,13,.24)]">
            <span className="absolute left-3 top-3 h-4 w-4 rounded-full bg-[#b91c1c] shadow-md" />
            <img src="/assets/eac/logo-oficial-imgur.jpg" alt="Logo EAC" className="h-32 w-32 rounded-full object-cover" />
            <div><p className="text-[42px] font-black leading-none text-[#0b4a88]">EAC</p><p className="mt-1 text-[17px] font-black uppercase leading-tight">Porciúncula<br />de Sant&apos;Anna</p></div>
          </div>
        </div>

        <div className="absolute right-9 top-9 rotate-3 rounded-[48%_52%_45%_55%] bg-[#facc15] px-8 py-5 shadow-[7px_8px_0_rgba(11,37,69,.18)]">
          <p className="text-[21px] font-black uppercase leading-tight">Vive o EAC!<br />Faz acontecer!</p>
        </div>

        <div className="absolute left-[245px] top-[190px] w-[720px] -rotate-2">
          <svg className="absolute -left-12 -top-11 h-[210px] w-[780px]" viewBox="0 0 780 210" preserveAspectRatio="none" aria-hidden="true">
            <path d="M9 82C87 34 162 72 239 37c104-48 201 35 303-2 78-29 153 5 224 33l-18 106c-119-22-210 22-320-2-126-28-244 27-409-7z" fill="#0b4a88" />
            <path d="M20 151c122-34 220 11 341-8 127-20 226 15 378-10" fill="none" stroke="#84cc16" strokeWidth="20" strokeLinecap="round" />
            <path d="M82 35c57-20 102-19 156-4" fill="none" stroke="#ef4444" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <h1 className="relative text-[95px] font-black uppercase italic leading-none tracking-[-.075em] text-white" style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: '5px 6px 0 #071525' }}>Agenda EAC</h1>
          <div className="relative ml-28 mt-3 inline-block rotate-1 bg-[#111827] px-14 py-3 shadow-[7px_8px_0_rgba(250,204,21,.85)]" style={{ clipPath: 'polygon(2% 7%,100% 0,97% 94%,0 100%)' }}>
            <p className="text-[49px] font-black uppercase italic leading-none text-white">{mes} <span className="text-[#a3e635]">{ano}</span></p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-12 pb-10 pt-4">
        <div className={`grid grid-cols-2 ${compact ? 'gap-x-7 gap-y-8' : 'gap-x-10 gap-y-11'}`}>
          {visibleEvents.length === 0 ? (
            <div className="relative col-span-2 mx-20 -rotate-1 bg-[#fffdf8] p-16 text-center shadow-2xl">
              <span className="absolute -top-5 left-[40%] h-10 w-44 rotate-2 bg-[#facc15]/80" />
              <p className="text-[34px] font-black uppercase">Ainda não há eventos publicados neste mês</p>
            </div>
          ) : visibleEvents.map((evento, index) => {
            const rotation = [-2.1, 1.5, 1.1, -1.5, -.8, 1.8, 1.2, -1.6][index];
            const tape = ['#facc15bb', '#75d5f5bb', '#a3e635bb', '#f2a5b5bb'][index % 4];
            return (
              <article key={`${evento.dia}-${evento.titulo}-${index}`} className={`${compact ? 'min-h-[226px]' : 'min-h-[260px]'} relative flex bg-[#fffdf8] p-5 shadow-[0_18px_28px_rgba(70,35,12,.30)]`} style={{ transform: `rotate(${rotation}deg)`, clipPath: 'polygon(1% 0,100% 1%,99% 98%,2% 100%)' }}>
                <span className="absolute -top-5 left-[36%] z-30 h-11 w-36 shadow-sm" style={{ backgroundColor: tape, transform: `rotate(${index % 2 ? -5 : 4}deg)`, clipPath: 'polygon(2% 7%,99% 0,96% 94%,0 100%)' }} />
                <span className="absolute right-5 top-4 h-4 w-4 rounded-full bg-[#b91c1c] shadow-[2px_4px_3px_rgba(0,0,0,.35)]" />
                <div className="flex w-[126px] shrink-0 items-center justify-center bg-[#111827] text-white shadow-inner" style={{ clipPath: 'polygon(4% 0,100% 3%,96% 100%,0 96%)' }}><EventIcon event={evento} /></div>
                <div className="ml-4 flex w-[92px] shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-[#d4c4ad] pr-4">
                  <span className="text-[57px] font-black leading-none text-[#dc2626]">{String(evento.dia).padStart(2, '0')}</span>
                  <span className="mt-2 text-[20px] font-black uppercase text-[#dc2626]">{evento.diaSemana.replace('.', '')}</span>
                </div>
                <div className="min-w-0 flex-1 py-2 pl-5">
                  <h2 className={`${compact ? 'text-[22px]' : 'text-[27px]'} font-black uppercase leading-[1.03]`}>{truncate(evento.titulo, compact ? 28 : 36)}</h2>
                  <p className="mt-3 text-[17px] font-bold text-slate-600">◷ {evento.horario || 'Horário a definir'}</p>
                  <span className="mt-4 inline-flex -rotate-1 bg-[#dc2626] px-4 py-1.5 text-[14px] font-black uppercase tracking-wide text-white" style={{ clipPath: 'polygon(2% 5%,100% 0,97% 94%,0 100%)' }}>{truncate(evento.tipo, 19)}</span>
                </div>
              </article>
            );
          })}
        </div>
        {sortedEvents.length > 8 && <div className="mx-auto mt-10 w-fit rotate-1 bg-[#facc15] px-7 py-3 text-[18px] font-black uppercase shadow-lg">+ {sortedEvents.length - 8} eventos no calendário completo</div>}
      </main>

      <footer className="relative z-10 mt-5 min-h-[430px] overflow-hidden">
        <div className="absolute -bottom-24 -left-24 h-[390px] w-[760px] -rotate-3 bg-[#f1e9da] shadow-xl" style={{ clipPath: 'polygon(0 8%,10% 2%,23% 7%,36% 1%,49% 8%,63% 2%,76% 7%,89% 0,100% 6%,96% 100%,0 100%)' }} />
        <div className="absolute bottom-[150px] left-10 w-[610px] -rotate-3 bg-[#101827] px-10 py-7 shadow-[9px_10px_0_rgba(163,230,53,.92)]" style={{ clipPath: 'polygon(2% 5%,100% 0,97% 95%,0 100%)' }}>
          <p className="text-[31px] font-black uppercase leading-tight text-white">Não fique de fora!</p>
          <p className="mt-1 text-[36px] font-black uppercase leading-[1.04] text-[#facc15]">Marque na agenda<br />e chame a galera!</p>
        </div>
        <div className="absolute bottom-11 left-12 -rotate-1 bg-white/90 px-6 py-4 text-[#0b2545] shadow-lg">
          <p className="text-[17px] font-black uppercase tracking-[.13em] text-[#0b4a88]">Acompanhe o EAC</p>
          <div className="mt-1 flex items-center gap-3"><InstagramIcon /><p className="text-[24px] font-black">@eacporciunculadesantana</p></div>
        </div>
        <svg className="absolute bottom-9 left-[680px] h-24 w-28 -rotate-12" viewBox="0 0 110 90" fill="none" stroke="#facc15" strokeWidth="8" strokeLinecap="round"><path d="M8 16c35-8 62 3 84 31M75 25l19 24-28 8" /></svg>
        <img src="/assets/eac/menina-eac.png" alt="Personagem EAC" className="pointer-events-none absolute bottom-0 right-[-12px] h-[430px] w-auto object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,.32)]" />
      </footer>
    </section>
  );
};

export default AgendaMensalShareEnhanced;
