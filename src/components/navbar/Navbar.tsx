import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { PATHS } from "@/routes/routes";
import Button2 from "../ui/button/Button2";

interface NavbarProps {
  logo: string;
  bgColor?: string;
  aStyles?: string;
  borderColor?: string;
  variantButton?: "primary" | "secondary" | "tertiary" | "quaternary";
  variantButton2?: "primary" | "secondary" | "tertiary" | "quaternary";
}
export default function Navbar({
  logo,
  bgColor,
  aStyles,
  borderColor,
}: NavbarProps) {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    await signOut();
    navigate(PATHS.root);
  };
  const handleNavigate = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      {/* Desktop (md+) - preserve existing style exactly */}
      <div className={`hidden md:flex ${bgColor} flex-row justify-between items-center p-4 px-16 text-black-300`}>
        <div className="w-32 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div className={`flex justify-between items-center space-x-4 gap-3 md:my-0 my-5 font-semibold border ${borderColor} rounded-full px-12 py-2`}>
          <a className={aStyles}>Info</a>
          <a onClick={() => navigate("/timeline")} className={aStyles}>Timeline</a>
          <a onClick={() => navigate("/museum")} className={aStyles}>Museum</a>
        </div>
        <div className="flex justify-between items-center space-x-3 font-semibold">
          {user ? (
            <>
              {isAdmin && (
                <Button2 onClick={() => navigate(PATHS.admin)} gradientHover="from-cyan-500 to-blue-500" borderColor="bg-cyan-500/70">Dashboard</Button2>
              )}
              <Button2 onClick={handleLogout}>Logout</Button2>
            </>
          ) : (
            <>
              <Button2 onClick={() => navigate(PATHS.login)}>Login</Button2>
              <Button2 onClick={() => navigate(PATHS.register)} gradientHover="from-purple-500 to-blue-500" borderColor="bg-purple-500/70">Register</Button2>
            </>
          )}
        </div>
      </div>

      {/* Mobile (below md) - hamburger with dropdown, inspired by Navbar3 */}
      <nav className="md:hidden w-full px-4 mt-4 z-50">
        <div className="relative mx-auto max-w-full">
          <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-xl bg-white/10 border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            {/* Logo */}
            <button aria-label="Home" onClick={() => handleNavigate(PATHS.root)} className="shrink-0">
              <div className="h-10 w-10 rounded-full border border-white/20 bg-white/5 grid place-items-center overflow-hidden">
                <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              </div>
            </button>
            {/* Title/Spacer */}
            <div className="justify-self-start" />
            {/* Hamburger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-full text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15A.75.75 0 0 1 3.75 12Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl p-2 backdrop-blur-xl bg-gray-800 border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col">
                {/* Links */}
                <button onClick={() => handleNavigate(PATHS.root)} className="text-left px-3 py-2 rounded-xl text-sm font-medium text-white/85 hover:text-white hover:bg-white/10">Info</button>
                <button onClick={() => handleNavigate(PATHS.timeline)} className="text-left px-3 py-2 rounded-xl text-sm font-medium text-white/85 hover:text-white hover:bg-white/10">Timeline</button>
                <button onClick={() => handleNavigate(PATHS.museum)} className="text-left px-3 py-2 rounded-xl text-sm font-medium text-white/85 hover:text-white hover:bg-white/10">Museum</button>
                {/* Auth */}
                <div className="px-2 pt-1 flex gap-2">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Button2 onClick={() => handleNavigate(PATHS.admin)} rounded="rounded-full" borderColor="bg-cyan-500/70" gradientHover="from-cyan-500 to-blue-500">Dashboard</Button2>
                      )}
                      <Button2 onClick={handleLogout} rounded="rounded-full">Logout</Button2>
                    </>
                  ) : (
                    <>
                      <Button2 onClick={() => handleNavigate(PATHS.login)} rounded="rounded-full">Login</Button2>
                      <Button2 onClick={() => handleNavigate(PATHS.register)} rounded="rounded-full" borderColor="bg-purple-500/70" gradientHover="from-purple-500 to-blue-500">Register</Button2>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
