import { useState } from "react";
import logo from "/images/favicon.ico";
import logo2 from "/images/logo2.png";
import { useNavigate } from "react-router-dom";
import Navbar3 from "@/components/navbar/Navbar3";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-[url('/images/30.png')] bg-cover bg-center min-h-screen bg-fixed bg-no-repeat flex flex-col">
      <Navbar3 logo={logo} />
      <div className="flex-1 flex items-center justify-center">
        <form>
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
              <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-5 justify-center">
                  <img src={logo2} alt="Logo" className="h-20" />
                </div>
                <div className="mt-5">
                  <label
                    className="font-semibold text-md text-gray-600 pb-1 block"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                    required
                  />
                  <label
                    className="font-semibold text-md text-gray-600 pb-1 block"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                    required
                  />
                  <label
                    className="font-semibold text-md text-gray-600 pb-1 block"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                    required
                  />
                </div>
                <div className="flex justify-center w-full items-center"></div>
                <div className="mt-5">
                  <button
                    className="py-2 px-35 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                    type="submit"
                  >
                    Sign up
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  <a
                    className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    or sign in
                  </a>
                  <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
