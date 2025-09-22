import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATHS } from "../../routes/routes";
import Button2 from "../ui/button/Button2";

interface NavbarProps3 {
  logo: string;
}
export default function Navbar3({ logo }: NavbarProps3) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Basic nav items; tweak labels/routes as needed
  const navItems: Array<{ label: string; to: string; onClick?: () => void }> = [
    { label: "Info", to: PATHS.timeline },
    { label: "Timeline", to: PATHS.timeline },
    { label: "Museum", to: PATHS.museum },
    { label: "About", to: PATHS.root },
  ];

  const handleNavigate = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <nav className="mt-6 top-4 z-50 w-full px-4">
      <div className="mx-auto flex justify-center">
        {/* Glass pill container */}
        <div
          className={[
            // layout: 3 columns -> logo | center (links) | right (cta/hamburger)
            "relative grid grid-cols-[auto_1fr_auto] items-center",
            // responsive gaps to keep logo and hamburger clearly separated on mobile
            "gap-2 sm:gap-3 md:gap-4 w-full",
            // responsive max-widths for better tablet/laptop scaling
            "max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-2xl",
            // padding scales with viewport
            "rounded-full px-2 sm:px-3 md:px-4 py-2",
            // glassmorphism
            "backdrop-blur-xl bg-white/10 border border-white/15",
            "shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
          ].join(" ")}
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          {/* Logo */}
          <button
            aria-label="Home"
            onClick={() => handleNavigate(PATHS.root)}
            className="shrink-0 pointer-events-auto"
          >
            <div className="h-9 w-9 sm:h-12 sm:w-12 rounded-full border cursor-pointer border-white/20 bg-white/5 grid place-items-center overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="h-9 w-9 sm:h-12 sm:w-12 object-contain"
              />
            </div>
          </button>

          {/* Center links - desktop */}
          <div className="hidden md:flex items-center justify-center gap-2 md:gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.to)}
                className={[
                  "px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-medium cursor-pointer",
                  "text-white/85 hover:text-white",
                  "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side: CTA (desktop) + Hamburger (mobile) */}
          <div className="flex items-center justify-end gap-1">
            <div className="hidden md:flex items-center pl-1">
              <Button2 onClick={() => handleNavigate(PATHS.register)}>
                Logout
              </Button2>
            </div>
            <div className="md:hidden flex items-center">
              <button
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="p-2 rounded-full text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {open ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15A.75.75 0 0 1 3.75 12Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {open && (
            <div
              className={[
                "absolute left-0 right-0 top-full mt-2",
                "rounded-2xl p-2",
                "backdrop-blur-xl bg-gray-800 border border-white/15",
                "shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
              ].join(" ")}
            >
              <div className="flex flex-col">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.to)}
                    className="text-left px-3 py-2 rounded-xl text-sm font-medium text-white/85 hover:text-white hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="px-2 pt-1">
                  <Button2
                    onClick={() => handleNavigate(PATHS.register)}
                    rounded="rounded-full"
                  >
                    Logout
                  </Button2>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
