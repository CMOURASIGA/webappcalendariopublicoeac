import React, { useMemo } from 'react';
import { EAC_COLORS } from '../types';

export type Evento = {
  dia: number;
  titulo: string;
  tipo: string;
  horario?: string;
};

type Props = {
  mes: string;
  ano: number;
  eventos: Evento[];
};

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
};

const AgendaMensalShare: React.FC<Props> = ({ mes, ano, eventos }) => {
  const sortedEvents = useMemo(() => {
    return [...eventos].sort((a, b) => {
      if (a.dia !== b.dia) return a.dia - b.dia;
      return a.titulo.localeCompare(b.titulo, 'pt-BR');
    });
  }, [eventos]);

  const eventRows = Math.max(Math.ceil(sortedEvents.length / 2), 1);
  const dynamicHeight = Math.max(1350, 680 + (eventRows * 190) + ((eventRows - 1) * 24));
  const monthLabel = mes.toUpperCase();

  return (
    <section
      className="relative overflow-hidden font-sans text-slate-900"
      style={{
        width: '1080px',
        height: `${dynamicHeight}px`,
        background: 'linear-gradient(165deg, #f5f3ee 0%, #f0efe9 48%, #ebe8df 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(1,67,115,0.045) 0px, rgba(1,67,115,0.045) 1px, transparent 1px, transparent 16px)',
          }}
        />
      </div>

      <header className="relative overflow-hidden bg-[#014373] px-16 pt-12 pb-10 text-white">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-radial-gradient(circle at 34% 82%, rgba(120,171,210,0.1) 0px, rgba(120,171,210,0.1) 18px, rgba(120,171,210,0) 18px, rgba(120,171,210,0) 58px)',
            }}
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-6">
            <img
              src="/assets/eac/logo-eac.png"
              alt="Logo EAC"
              className="h-24 w-auto object-contain drop-shadow-md"
            />
            <p className="text-[26px] font-bold leading-tight">
              EAC - Porciúncula de Sant&apos;Anna
            </p>
          </div>
          <h1 className="mt-9 text-[56px] font-bold uppercase tracking-[0.08em] leading-none">
            AGENDA {monthLabel} {ano}
          </h1>
        </div>
      </header>

      <main className="px-14 pt-10 pb-[300px]">
        <div className="mb-6 flex justify-end">
          <div
            className="rotate-[-7deg] rounded-2xl px-7 py-3 shadow-[0_10px_20px_rgba(9,50,92,0.18)]"
            style={{ backgroundColor: '#F3C74E', border: '1px solid rgba(9,50,92,0.16)' }}
          >
            <span className="text-[20px] font-black uppercase tracking-[0.04em] text-[#09325C]">
              CONFIRA OS PROXIMOS EVENTOS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {sortedEvents.length === 0 ? (
            <div className="col-span-2 rounded-3xl border border-[#d1dbe7] bg-white p-10 shadow-sm text-center">
              <p className="text-[28px] font-black uppercase tracking-[0.08em] text-[#09325C]">
                Sem eventos neste mes
              </p>
            </div>
          ) : (
            sortedEvents.map((evento, index) => (
              <article
                key={`${evento.dia}-${evento.titulo}-${index}`}
                className="rounded-[32px] border border-[#014373]/15 bg-white/95 p-6 shadow-[0_12px_28px_rgba(9,50,92,0.10)] min-h-[156px]"
              >
                <div className="flex gap-5">
                  <span className="w-14 shrink-0 text-[52px] leading-none font-black text-[#014373] tabular-nums">
                    {String(evento.dia).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h2 className="text-[27px] leading-tight font-black text-[#09325C]">
                      {truncate(evento.titulo, 48)}
                    </h2>
                    {evento.horario ? (
                      <p className="mt-2 text-[19px] font-semibold text-slate-500 uppercase">
                        {evento.horario}
                      </p>
                    ) : null}
                    <span
                      className="mt-4 inline-flex rounded-full px-4 py-1.5 text-[16px] font-black uppercase tracking-[0.06em]"
                      style={{ backgroundColor: EAC_COLORS.primaryDark, color: '#FFFFFF' }}
                    >
                      {truncate(evento.tipo, 24)}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <div className="absolute bottom-16 left-14 z-10">
        <p className="text-[28px] font-semibold text-[#09325C]">
          🔁 Manda no grupo da galera
        </p>
      </div>

      <img
        src="/assets/eac/menina-eac.png"
        alt="Personagem EAC"
        className="pointer-events-none absolute bottom-0 right-6 w-[300px] object-contain drop-shadow-[0_18px_30px_rgba(9,50,92,0.25)]"
        style={{ transform: 'rotate(-4deg)', transformOrigin: 'bottom right' }}
      />
    </section>
  );
};

export default AgendaMensalShare;
