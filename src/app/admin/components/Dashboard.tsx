"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  userEmail: string;
  totalProjects: number;
}

export default function Dashboard({ userEmail, totalProjects }: DashboardProps) {
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [trafficData, setTrafficData] = useState<
    { date: string; visits: number }[]
  >([]);
  const [filter, setFilter] = useState<"7days" | "30days" | "all">("7days");

  useEffect(() => {
    const logTraffic = async () => {
      const today = new Date().toISOString().split("T")[0];

      // 🔹 Update / Insert traffic hari ini
      const { data: existing } = await supabase
        .from("daily_traffic")
        .select("*")
        .eq("date", today)
        .single();

      if (existing) {
        await supabase
          .from("daily_traffic")
          .update({ visits: existing.visits + 1 })
          .eq("date", today);
      } else {
        await supabase.from("daily_traffic").insert([{ date: today, visits: 1 }]);
      }

      fetchTrafficData(filter);
    };

    logTraffic();
  }, []);

  // 🔹 Ambil data dari Supabase berdasarkan filter
  const fetchTrafficData = async (range: "7days" | "30days" | "all") => {
    const { data, error } = await supabase
      .from("daily_traffic")
      .select("date, visits")
      .order("date", { ascending: true });

    if (error || !data) return;

    let filteredData = data;
    const today = new Date();

    if (range === "7days") {
      const cutoff = new Date();
      cutoff.setDate(today.getDate() - 6);
      filteredData = data.filter((d) => new Date(d.date) >= cutoff);
    } else if (range === "30days") {
      const cutoff = new Date();
      cutoff.setDate(today.getDate() - 29);
      filteredData = data.filter((d) => new Date(d.date) >= cutoff);
    }

    // Update state statistik
    const total = filteredData.reduce((sum, d) => sum + d.visits, 0);
    const todayData = filteredData.find((d) => d.date === today.toISOString().split("T")[0]);

    setTrafficData(filteredData);
    setTodayVisits(todayData?.visits || 0);
    setTotalVisits(total);
  };

  // 🔹 Ganti filter waktu
  const handleFilterChange = (value: "7days" | "30days" | "all") => {
    setFilter(value);
    fetchTrafficData(value);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-2 text-orange-400">
        Welcome Admin
      </h1>
      <p className="text-center text-lg mb-12">{userEmail}</p>

      {/* Stats Section */}
      <section className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-orange-400" size={28} />
          <h2 className="text-xl font-semibold">📈 Traffic Analytics</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Overview of visitors and project statistics.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-lg font-medium">Today’s Visits</p>
            <p className="text-3xl font-bold text-orange-400">{todayVisits}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-lg font-medium">Total Visits</p>
            <p className="text-3xl font-bold text-orange-400">{totalVisits}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-lg font-medium">Total Projects</p>
            <p className="text-3xl font-bold text-orange-400">{totalProjects}</p>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-400">
            📊 Traffic Trend
          </h2>

          <select
            value={filter}
            onChange={(e) =>
              handleFilterChange(e.target.value as "7days" | "30days" | "all")
            }
            className="bg-gray-700 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {trafficData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#ccc", fontSize: 12 }}
                tickFormatter={(d) => d.slice(5)} // tampilkan MM-DD
              />
              <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  color: "#fff",
                }}
                labelStyle={{ color: "#f97316" }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5, fill: "#f97316" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No traffic data available for this range.
          </p>
        )}
      </section>
    </div>
  );
}
