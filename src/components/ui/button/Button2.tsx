import React from "react";

interface Button2Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  gradientHover?: string; // Tailwind gradient colors (after bg-gradient-to-r)
  bgColor?: string; // Interior background color
  className?: string;
  disabled?: boolean;
  borderColor?: string;
}

function Button2({
  onClick,
  type = "button",
  children,
  gradientHover = "from-teal-400 via-blue-500 to-purple-500",
  bgColor = "bg-gray-950",
  borderColor = "bg-gray-800",
}: Button2Props) {
  return (
    <div className="relative inline-block group">
      <button
        type={type}
        onClick={onClick}
        className={[
          "relative p-px font-semibold leading-6 text-white",
          `${borderColor} rounded-xl shadow-2xl shadow-zinc-900`,
          "transition-transform duration-300 ease-in-out",
          "hover:scale-105 active:scale-95",
          "focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientHover} p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
        <span className={`relative z-10 block px-3 py-3 rounded-xl ${bgColor}`}>
          <span className="relative z-10 flex items-center space-x-2">
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              {children}
            </span>
            <svg
              className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}

export default Button2;
