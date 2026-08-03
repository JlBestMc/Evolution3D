import { memo } from "react";

function formatAge(startMa?: number) {
  if (startMa == null) return null;
  if (startMa >= 1000)
    return `${(startMa / 1000).toFixed(startMa % 1000 ? 1 : 0)} Ga`;
  if (startMa < 1) return `${startMa.toFixed(2)} Ma`;
  return `${
    Number.isInteger(startMa) ? startMa.toFixed(0) : startMa.toFixed(1)
  } Ma`;
}

export const AnimalHeader = memo(function AnimalHeader({
  name,
  eraColor,
  startMa,
  subtitle,
  eraName,
}: {
  name: string;
  eraColor: string;
  startMa?: number;
  subtitle?: string;
  eraName?: string;
}) {
  const age = formatAge(startMa);
  return (
    <header>
      <div className="observatory-meta flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        <span>Specimen</span>
        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: eraColor }} />
        <span>{eraName ?? "field record"}</span>
        {age && <span className="text-white/70">{age}</span>}
      </div>
      <h1
        className="observatory-display mt-4 max-w-full break-words text-4xl leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
        style={{ textShadow: `0 0 38px ${eraColor}32` }}
      >
        {name}
      </h1>
      {subtitle && (
        <p className="mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
          {subtitle}
        </p>
      )}
      <div className="mt-6 h-px w-full max-w-sm" style={{ background: `linear-gradient(90deg, ${eraColor}, transparent)` }} />
    </header>
  );
});

export default AnimalHeader;
