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
  const dynamicHeight = Math.max(1350, 600 + (eventRows * 190) + ((eventRows - 1) * 24));
  const monthLabel = mes.toUpperCase();

  return (
    <section
      className="relative overflow-hidden bg-[#F0EFE9] font-sans text-slate-900"
      style={{ width: '1080px', height: `${dynamicHeight}px` }}
    >
      <header className="bg-[#014373] px-16 pt-12 pb-10 text-white">
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
        <h1 className="mt-9 text-[56px] font-black uppercase tracking-[0.06em] leading-none">
          AGENDA {monthLabel} {ano}
        </h1>
      </header>

      <main className="px-14 pt-12 pb-[300px]">
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
                className="rounded-3xl border border-[#d1dbe7] bg-white p-5 shadow-sm min-h-[150px]"
              >
                <div className="flex gap-4">
                  <span className="w-14 shrink-0 text-[52px] leading-none font-black text-[#014373] tabular-nums">
                    {String(evento.dia).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 pt-1">
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
          Voce pode compartilhar esta imagem com seu grupo.
        </p>
      </div>

      <img
        src="/assets/eac/menina-eac.png"
        alt="Personagem EAC"
        className="pointer-events-none absolute bottom-0 right-6 w-[300px] object-contain drop-shadow-[0_18px_30px_rgba(9,50,92,0.25)]"
      />
    </section>
  );
};

export default AgendaMensalShare;
