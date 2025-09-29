import React, { useRef } from "react";

export function DragSafeCard({ onActivate, children }: { onActivate: () => void; children: React.ReactNode }) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const THRESHOLD = 6; // pixels

  const onPointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  };

  const onPointerMoveCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = startRef.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (dx * dx + dy * dy > THRESHOLD * THRESHOLD) movedRef.current = true;
  };

  const onPointerUpCapture = () => {
    startRef.current = null;
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
      return;
    }
    onActivate();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  return (
    <div
      className="snap-center px-4 pt-5 md:snap-start shrink-0 snap-stop cursor-pointer focus:outline-none rounded-lg"
      role="button"
      tabIndex={0}
      onPointerDownCapture={onPointerDownCapture}
      onPointerMoveCapture={onPointerMoveCapture}
      onPointerUpCapture={onPointerUpCapture}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}