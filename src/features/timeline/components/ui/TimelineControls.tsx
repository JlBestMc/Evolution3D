import { eras } from "@/data/eras";
import ButtonControl from "@/components/ui/ButtonControl";

type Props = {
  index: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (id: string) => void;
  activeColor: string;
};

export default function TimelineControls({
  index,
  loading,
  onPrev,
  onNext,
  onSelect,
}: Props) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <ButtonControl
        onClick={onPrev}
        disabled={index === 0 || loading}
        direction="left"
        size="sm"
        appearance="glass"
        ariaLabel="Previous era"
      >
        Prev
      </ButtonControl>

      <div className="relative rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 p-px shadow-[0_16px_40px_-18px_rgba(0,0,0,0.98)]">
        <div className="flex min-h-11 items-center gap-3 rounded-full bg-black/80 px-3 py-2 backdrop-blur-md sm:gap-4 sm:px-4">
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-100/75 sm:inline">
            {String(index + 1).padStart(2, "0")} / {String(eras.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2" role="tablist" aria-label="Eras">
            {eras.map((e, i) => (
              <button
                key={e.id}
                onClick={() => !loading && onSelect(e.id)}
                disabled={loading}
                title={e.name}
                aria-label={e.name}
                aria-selected={i === index}
                role="tab"
                className={`rounded-full border transition-[width,background-color,box-shadow] duration-300 ${
                  i === index
                    ? "h-2.5 w-7 border-white shadow-[0_0_16px_var(--active-era-color)]"
                    : "h-2.5 w-2.5 border-white/25 bg-white/10 hover:border-violet-200/70 hover:bg-violet-400/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ButtonControl
        onClick={onNext}
        disabled={index === eras.length - 1 || loading}
        direction="right"
        size="sm"
        appearance="glass"
        ariaLabel="Next era"
      >
        Next
      </ButtonControl>
    </div>
  );
}
