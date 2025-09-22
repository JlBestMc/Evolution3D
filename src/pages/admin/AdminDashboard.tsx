import { useState } from "react";
import AnimalsAdmin from "./AnimalsAdmin.tsx";
import ErasAdmin from "./ErasAdmin.tsx";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"animals" | "eras">("animals");
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm ${tab === "animals" ? "bg-white/10" : "hover:bg-white/5"}`}
            onClick={() => setTab("animals")}
          >
            Animals
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${tab === "eras" ? "bg-white/10" : "hover:bg-white/5"}`}
            onClick={() => setTab("eras")}
          >
            Eras
          </button>
        </div>
        <div className="mt-6">
          {tab === "animals" ? <AnimalsAdmin /> : <ErasAdmin />}
        </div>
      </div>
    </div>
  );
}
