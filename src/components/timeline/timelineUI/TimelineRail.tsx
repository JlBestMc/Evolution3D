import { eras } from "../../../data/eras";

type Props = {
  index: number;
  loading: boolean;
  onSelect: (id: string) => void;
};

export default function TimelineRail({ index, loading, onSelect }: Props) {
  return (
    <div className="mt-6 w-full sm:w-[92vw] max-w-[1024px] relative select-none px-3 sm:px-0">
      {/* Background capsule */}
      <div className="absolute inset-x-1 sm:inset-x-2 top-0 bottom-0 rounded-2xl bg-white/[0.03] border border-white/10" />

  {/* Línea principal con glow (acortada en los extremos) */}
  <div className="absolute left-6 right-6 sm:left-10 sm:right-10 top-1/2 -translate-y-1/2 h-[2px] bg-white/30" />
  <div className="absolute left-6 right-6 sm:left-10 sm:right-10 top-1/2 -translate-y-1/2 h-[6px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md" />


      {/* Nodos de eras + miniaturas + labels (más alto para mayor margen) */}
      <div className="relative flex items-center justify-between px-6 sm:px-10 py-4 h-40 sm:h-44">
        {eras.map((e, i) => (
          <div key={e.id} className="relative flex flex-col items-center h-full" style={{ minWidth: 0 }}>
            {/* Miniatura */}
            <button
              onClick={() => !loading && onSelect(e.id)}
              className={`w-14 h-10 sm:w-16 sm:h-11 mb-8 sm:mb-10 rounded-md overflow-hidden ring-1 ${
                i === index ? "ring-white/80 shadow-md" : "ring-white/70"
              }`}
              aria-label={`${e.name} thumbnail`}
            >
              <img src={e.background} alt={e.name} className="w-full h-full object-cover" draggable={false} />
            </button>

            {/* Nodo */}
            <button
              aria-label={e.name}
              onClick={() => !loading && onSelect(e.id)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full border ${
                i === index
                  ? "bg-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  : "bg-white/20 border-white/60 hover:bg-white/40"
              }`}
            />

            {/* Nombre y periodo */}
            <div className="mt-2 text-center">
              <div
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] sm:text-[14px] font-semibold tracking-wide ${
                  i === index ? "bg-white text-black" : "bg-white/10 text-white/90 border border-white/20"
                } whitespace-nowrap`}
                title={e.name}
              >
                {e.name}
              </div>
              {e.period && (
                <div className="hidden sm:block mt-1 text-[10px] font-medium tracking-wide text-white/70 whitespace-nowrap" title={e.period}>
                  {e.period}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
