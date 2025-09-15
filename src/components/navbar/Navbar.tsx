import { useNavigate } from "react-router-dom";
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

  return (
    <>
      <div
        className={`flex ${bgColor} flex-col md:flex-row justify-between items-center p-4 px-16 text-black-300`}
      >
        <div
          className="w-32 cursor-pointer mr-28"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div
          className={`flex justify-between items-center space-x-4 gap-3 md:my-0 my-5 font-semibold border ${borderColor} rounded-full px-12 py-2`}
        >
          <a className={aStyles}>Info</a>
          <a onClick={() => navigate("/timeline")} className={aStyles}>
            Timeline
          </a>
          <a onClick={() => navigate("/museum")} className={aStyles}>More</a>
        </div>
        <div className="flex justify-between items-center space-x-3  font-semibold">
          <Button2 onClick={() => navigate("/timeline")}>Login</Button2>
          <Button2
            onClick={() => navigate("/register")}
            gradientHover="from-purple-500 to-blue-500"
            borderColor="bg-purple-500/70"
          >
            Register
          </Button2>
        </div>
      </div>
    </>
  );
}
