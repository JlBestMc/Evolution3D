export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-white/70 mt-1">{subtitle}</p>}
      <div
        className="mt-3 h-[3px] w-28 rounded-full"
        style={{ background: "linear-gradient(90deg, #f7d77a, #ffffff)" }}
      />
    </div>
  );
}

export default AdminHeader;