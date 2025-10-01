import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/routes";

interface NavbarProps {
  logo: string;
  bgColor?: string;
  aStyles?: string;
  borderColor?: string;
  variantButton?: "primary" | "secondary" | "tertiary" | "quaternary";
  variantButton2?: "primary" | "secondary" | "tertiary" | "quaternary";
}

export default function Navbar2({ logo }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = useMemo(
    () => [
      { label: "Explore", to: PATHS.timeline },
      { label: "About", to: PATHS.era },
      { label: "Careers", to: PATHS.root },
      { label: "Resources", to: PATHS.museum },
    ],
    []
  );

  const isActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <div className="mt-5 mb-5 z-50 w-full px-3 sm:px-4">
        <div className="mx-auto max-w-5xl rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between px-2 sm:px-3">
            <button
              aria-label="Home"
              onClick={() => navigate(PATHS.root)}
              className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition"
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="size-6 sm:size-7 rounded-full object-contain"
                />
              ) : (
                <span className="size-6 sm:size-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-inner" />
              )}
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={[
                    "px-3 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive(l.to)
                      ? "text-white bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate(PATHS.login)}
                className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-white/90 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Log In
              </button>

              <button
                aria-label="Toggle Menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex md:hidden items-center justify-center size-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  {open ? (
                    <path
                      fillRule="evenodd"
                      d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={[
          "md:hidden fixed inset-x-0 top-0 z-40 px-3 pt-20 pb-6 transition-opacity",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setOpen(false)}
      >
        <div
          className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              {logo ? (
                <img src={logo} className="size-7 rounded-full" alt="Logo" />
              ) : (
                <span className="size-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600" />
              )}
              <span className="text-white/90 font-semibold">Menu</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center size-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 transition"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <nav className="px-2 py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  "block w-full px-4 py-3 text-base rounded-xl",
                  isActive(l.to)
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}

            <button
              onClick={() => navigate(PATHS.login)}
              className="mt-2 w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-white/90 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Log In
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
