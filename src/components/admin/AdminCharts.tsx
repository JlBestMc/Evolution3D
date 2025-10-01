import { useMemo } from "react";
import animals from "@/data/animals";
import { eras } from "@/data/eras";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function useCounts() {
  const byEra = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of eras) map.set(e.id, 0);
    for (const a of animals) {
      if (a.eraId) map.set(a.eraId, (map.get(a.eraId) ?? 0) + 1);
    }
    return eras.map((e) => ({
      era: e.name,
      id: e.id,
      count: map.get(e.id) ?? 0,
      color: e.color,
    }));
  }, []);

  const byClass = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of animals) {
      const k = a.className ?? "Unknown";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return { byEra, byClass };
}

export default function AdminCharts() {
  const { byEra, byClass } = useCounts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Animals per Era</CardTitle>
          <CardDescription>
            Total animals grouped by geological era
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byEra} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
                <XAxis
                  dataKey="era"
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid #095dd2",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="count" fill="#9a7916" radius={[6, 6, 0, 0]}>
                  {byEra.map((e, i) => (
                    <rect key={e.id + i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Animals per Class</CardTitle>
          <CardDescription>Distribution by biological class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff18" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0b1220",
                    border: "1px solid #1f2937",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="count" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
