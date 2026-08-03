import { cn } from "@/lib/utils";

type ButtonControlProps = {
  direction?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
  disabled?: boolean;
  appearance?: "gradient" | "glass";
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const sizeMap = {
  sm: {
    outer: "h-11 w-11 p-[3px] rounded-[14px]",
    inner: "rounded-[11px]",
    icon: "h-4 w-4",
  },
  md: {
    outer: "h-14 w-14 p-1 rounded-[18px]",
    inner: "rounded-[14px]",
    icon: "h-5 w-5",
  },
  lg: {
    outer: "h-16 w-16 p-1 rounded-[22px]",
    inner: "rounded-[18px]",
    icon: "h-6 w-6",
  },
} as const;

export default function ButtonControl({
  direction = "right",
  size = "md",
  className,
  iconClassName,
  disabled = false,
  appearance = "gradient",
  type = "button",
  ariaLabel,
  onClick,
}: ButtonControlProps) {
  const cfg = sizeMap[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (direction === "left" ? "Previous" : "Next")}
      className={cn(
        "group relative inline-flex items-center cursor-pointer justify-center",
        cfg.outer,
        appearance === "glass"
          ? "bg-gradient-to-br from-cyan-400/80 via-blue-500/75 to-purple-500/85 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          : "bg-zinc-300/80 ring-1 ring-zinc-500/70 shadow-[0_5px_10px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "disabled:opacity-40 disabled:transform-none",
        "hover:opacity-90",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-1",
          cfg.inner,
          appearance === "glass"
            ? "bg-[#071216]/95 ring-1 ring-white/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]"
            : "bg-gradient-to-br from-[#a12eff] via-[#7a8be4] to-[#2b40ff] ring-1 ring-white/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_18px_rgba(61,92,255,0.45)]"
        )}
      />

      <svg
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className={cn(
          "relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
          cfg.icon,
          iconClassName
        )}
      >
        {direction === "left" ? (
          <path
            d="M11.5 5.5 7 10l4.5 4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M8.5 5.5 13 10l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
