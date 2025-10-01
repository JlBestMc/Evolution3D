import { eras } from "../../../data/eras";
import { Button } from "../../ui/button/Button";

type Props = {
  index: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (id: string) => void;
};

export default function TimelineControls({ index, loading, onPrev, onNext, onSelect }: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* Prev */}
      <Button
        variant="tertiary"
        onClick={onPrev}
        disabled={index === 0 || loading}
        styles="!px-3 !py-2 text-xs disabled:opacity-30 flex items-center gap-1.5"
        aria-label="Anterior"
      >
        Prev
      </Button>

      {/* Center group: current label + bullets */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          {eras.map((e, i) => (
            <button
              key={e.id}
              onClick={() => !loading && onSelect(e.id)}
              title={e.name}
              aria-label={e.name}
              className={`border rounded-full ${
                i === index
                  ? "w-6 md:w-7 h-3 bg-white border-white shadow"
                  : "w-2.5 h-2.5 md:w-3 md:h-3 bg-white/10 border-white/40 hover:bg-white/30"
              }`}
              style={{ transition: "none" }}
            />
          ))}
        </div>
      </div>

      {/* Next */}
      <Button
        variant="tertiary"
        onClick={onNext}
        disabled={index === eras.length - 1 || loading}
        styles="!px-3 !py-2 text-xs disabled:opacity-30 flex items-center gap-1.5"
        aria-label="Siguiente"
      >
        Next
      </Button>
    </div>
  );
}
