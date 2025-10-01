function formatAge(startMa?: number) {
  if (startMa == null) return null;
  if (startMa >= 1000)
    return `${(startMa / 1000).toFixed(startMa % 1000 ? 1 : 0)} Ga`;
  if (startMa < 1) return `${startMa.toFixed(2)} Ma`;
  return `${
    Number.isInteger(startMa) ? startMa.toFixed(0) : startMa.toFixed(1)
  } Ma`;
}

export function AnimalHeader({
  name,
  eraColor,
  startMa,
}: {
  name: string;
  eraColor: string;
  startMa?: number;
}) {
  const age = formatAge(startMa);
  return (
    <header className="mb-4">
      <h1
        className=" text-3xl md:text-4xl font-semibold tracking-tight"
        style={{
          backgroundImage: `linear-gradient(90deg, ${eraColor}, #ffffff, #ffffff, #ffffff)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {name}
      </h1>
      <div
        className="mt-3 h-[3px] w-24 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${eraColor}, transparent)`,
        }}
      />
      {age && <p className="mt-1 text-white/70 text-sm">≈ {age}</p>}
    </header>
  );
}

export default AnimalHeader;
