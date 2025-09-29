import { useState } from "react";
import AnimalsAdmin from "./AnimalsAdmin.tsx";
import ErasAdmin from "./ErasAdmin.tsx";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminCharts from "@/components/admin/AdminCharts";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"animals" | "eras">("animals");
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <section className="relative z-10 container mx-auto px-6 py-8">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Manage animals, eras and models"
        />
        <div className="mt-6">
          <AdminCharts />
        </div>
        <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/5 p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "animals" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setTab("animals")}
          >
            Animals
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "eras" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setTab("eras")}
          >
            Eras
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl p-4 md:p-6">
          {tab === "animals" ? <AnimalsAdmin /> : <ErasAdmin />}
        </div>
      </section>
    </main>
  );
}
