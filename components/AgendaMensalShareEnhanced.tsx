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

type Density = 'few' | 'medium' | 'many';

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
};

const AgendaMensalShareEnhanced: React.FC<Props> = ({ mes, ano, eventos }) => {
  const sortedEvents = useMemo(() => {
    return [...eventos].sort((a, b) => {
      if (a.dia !== b.dia) return a.dia - b.dia;
      if ((a.horario ?? '') !== (b.horario ?? '')) {
        return (a.horario ?? '').localeCompare(b.horario ?? '', 'pt-BR');
      }
      return a.titulo.localeCompare(b.titulo, 'pt-BR');
    });
  }, [eventos]);

  const totalEvents = sortedEvents.length;
  const density: Density = totalEvents >= 9 ? 'many' : totalEvents >= 5 ? 'medium' : 'few';
  const rows = Math.max(Math.ceil(totalEvents / 2), 1);
  const rowHeight = density === 'many' ? 178 : density === 'medium' ? 206 : 226;
  const rowGap = density === 'many' ? 18 : 22;
  const headerHeight = 430;
  const footerHeight = 330;
  const dynamicHeight = Math.max(
    1536,
    headerHeight + footerHeight + (rows * rowHeight) + (Math.max(rows - 1, 0) * rowGap)
  );

  const cardClass = density === 'many'
    ? 'min-h-[168px] rounded-[28px] p-5'
    : density === 'medium'
      ? 'min-h-[194px] rounded-[32px] p-6'
      : 'min-h-[214px] rounded-[34px] p-7';
  const dayClass = density === 'many' ? 'text-[48px]' : density === 'medium' ? 'text-[56px]' : 'text-[62px]';
  const titleClass = density === 'many' ? 'text-[24px]' : density === 'medium' ? 'text-[27px]' : 'text-[30px]';
  const typeClass = density === 'many' ? 'text-[13px]' : 'text-[15px]';

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f5] font-sans text-[#092b5c]"
      style={{ width: '1080px', height: `${dynamicHeight}px` }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-32 h-80 w-52 rotate-[-12deg] rounded-[48%] bg-[#b8df12]" />
        <div className="absolute -right-28 -top-16 h-72 w-64 rotate-12 rounded-[42%] bg-[#1265d8]" />
        <div className="absolute right-8 top-[360px] grid grid-cols-3 gap-3 opacity-60">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="h-3 w-3 rounded-full bg-[#1265d8]" />
          ))}
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(9,43,92,0.12) 0.8px, transparent 0.8px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      <header className="relative z-10 px-14 pb-8 pt-10">
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-center gap-5">
            <img
              src="/assets/eac/logo-eac.png"
              alt="Logo EAC"
              className="h-24 w-auto object-contain drop-shadow-md"
            />
            <div>
              <p className="text-[42px] font-black leading-none text-[#092b5c]">EAC</p>
              <p className="mt-2 text-[20px] font-black uppercase leading-tight tracking-[0.04em]">
                Porciúncula<br />de Sant&apos;Anna
              </p>
            </div>
          </div>
          <div className="rotate-[-4deg] rounded-[22px] bg-[#f6c83f] px-7 py-4 shadow-lg">
            <p className="text-[20px] font-black uppercase leading-tight">Vive o EAC!<br />Faz acontecer!</p>
          </div>
        </div>

        <div className="mt-7 text-center">
          <p className="text-[74px] font-black uppercase leading-none tracking-[-0.04em] text-[#092b5c]">
            Agenda EAC
          </p>
          <div className="mx-auto mt-3 inline-flex rotate-[-1deg] bg-[#1265d8] px-12 py-3 shadow-xl">
            <p className="text-[54px] font-black uppercase leading-none text-white">
              {mes} <span className="text-[#c4ec19]">{ano}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-10">
        <div className={`grid grid-cols-2 ${density === 'many' ? 'gap-4' : 'gap-5'}`}>
          {sortedEvents.length === 0 ? (
            <div className="col-span-2 rounded-[34px] border border-slate-200 bg-white p-14 text-center shadow-xl">
              <p className="text-[34px] font-black uppercase tracking-[0.04em]">Sem eventos neste mês</p>
              <p className="mt-3 text-[20px] font-bold text-slate-500">Acompanhe as próximas atualizações do EAC.</p>
            </div>
          ) : (
            sortedEvents.map((evento, index) => (
              <article
                key={`${evento.dia}-${evento.titulo}-${evento.horario ?? ''}-${index}`}
                className={`${cardClass} flex border border-slate-200 bg-white shadow-[0_14px_30px_rgba(9,43,92,0.13)] ${
                  totalEvents % 2 === 1 && index === totalEvents - 1 ? 'col-span-2 mx-auto w-[49%]' : ''
                }`}
              >
                <div className="flex w-[118px] shrink-0 flex-col items-center justify-center border-r border-red-100 pr-5">
                  <span className={`${dayClass} font-black leading-none text-[#df1425] tabular-nums`}>
                    {String(evento.dia).padStart(2, '0')}
                  </span>
                  <span className="mt-2 text-[21px] font-black uppercase tracking-[0.08em] text-[#df1425]">
                    {evento.diaSemana.replace('.', '')}
                  </span>
                </div>

                <div className="min-w-0 flex-1 pl-6">
                  <h2 className={`${titleClass} font-black uppercase leading-[1.04] text-[#092b5c]`}>
                    {truncate(evento.titulo, density === 'many' ? 35 : 44)}
                  </h2>
                  <p className="mt-3 text-[18px] font-bold text-slate-600">
                    ◷ {evento.horario || 'Horário a definir'}
                  </p>
                  <span className={`mt-4 inline-flex rounded-full bg-[#df1425] px-4 py-1.5 ${typeClass} font-black uppercase tracking-[0.06em] text-white`}>
                    {truncate(evento.tipo, 24)}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 z-10 h-[310px] overflow-hidden">
        <div className="absolute bottom-24 left-10 w-[575px] rotate-[-2deg] bg-[#092b5c] px-8 py-6 shadow-xl">
          <p className="text-[27px] font-black uppercase leading-tight text-white">
            Não fique de fora!
          </p>
          <p className="mt-1 text-[30px] font-black uppercase leading-tight text-[#c4ec19]">
            Marque na agenda<br />e chame a galera!
          </p>
        </div>

        <div className="absolute bottom-8 left-12">
          <p className="text-[22px] font-black uppercase tracking-[0.05em]">Siga nossas redes!</p>
          <p className="mt-2 text-[21px] font-black">@EAC.PORCIUNCULA</p>
        </div>

        <img
          src="/assets/eac/menina-eac.png"
          alt="Personagem EAC"
          className="pointer-events-none absolute bottom-0 right-4 h-[305px] w-auto object-contain drop-shadow-[0_18px_30px_rgba(9,43,92,0.25)]"
        />
      </footer>
    </section>
  );
};

export default AgendaMensalShareEnhanced;
