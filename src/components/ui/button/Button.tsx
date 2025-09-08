import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  styles?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  styles = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "hover:bg-gradient-to-r hover:from-blue-950 hover:to-purple-950 text-white hover:border-purple-900 border-purple-900 border",
    secondary:
      "bg-gradient-to-r from-blue-950 to-purple-950 text-[#f4f8ff] hover:from-transparent hover:to-transparent hover:border-purple-900 border-purple-900 border",
    tertiary:
      "bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs tracking-wide uppercase transition-colors",
    quaternary:
      "bg-gradient-to-r from-[#90cea1] to-[#01b4e4] text-white hover:from-transparent hover:to-transparent hover:border-cyan-300 border-[#0d253f] border",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${styles}`}
    >
      {children}
    </button>
  );
};

export default Button;
