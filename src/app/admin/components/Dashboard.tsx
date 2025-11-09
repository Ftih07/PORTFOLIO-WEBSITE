"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import {
  BarChart3,
  TrendingUp,
  Users,
  FolderKanban,
  Calendar,
  Activity,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DashboardProps {
  userEmail: string;
  totalProjects: number;
}

export default function Dashboard({
  userEmail,
  totalProjects,
}: DashboardProps) {
  const [todayVisits, setTodayVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [trafficData, setTrafficData] = useState<
    { date: string; visits: number }[]
  >([]);
  const [filter, setFilter] = useState<"7days" | "30days" | "all">("7days");
  const [loading, setLoading] = useState(true);

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
        await supabase
          .from("daily_traffic")
          .insert([{ date: today, visits: 1 }]);
      }

      await fetchTrafficData(filter);
      setLoading(false);
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
    const todayData = filteredData.find(
      (d) => d.date === today.toISOString().split("T")[0]
    );

    setTrafficData(filteredData);
    setTodayVisits(todayData?.visits || 0);
    setTotalVisits(total);
  };

  // 🔹 Ganti filter waktu
  const handleFilterChange = (value: "7days" | "30days" | "all") => {
    setFilter(value);
    fetchTrafficData(value);
  };

  // Calculate statistics
  const avgVisitsPerDay =
    trafficData.length > 0 ? Math.round(totalVisits / trafficData.length) : 0;
  const percentageChange =
    trafficData.length >= 2
      ? Math.round(
          ((trafficData[trafficData.length - 1].visits -
            trafficData[trafficData.length - 2].visits) /
            trafficData[trafficData.length - 2].visits) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-xl border border-purple-500/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-purple-100 text-lg">{userEmail}</p>
            <p className="text-purple-200 text-sm mt-2">
              Heres whats happening with your portfolio today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
              <Activity className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Visits */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-400" size={24} />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg">
              TODAY
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">Today Visits</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-white">{todayVisits}</p>
            {percentageChange !== 0 && (
              <span
                className={`text-sm font-semibold mb-1 flex items-center gap-1 ${
                  percentageChange > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                <TrendingUp
                  size={14}
                  className={percentageChange < 0 ? "rotate-180" : ""}
                />
                {Math.abs(percentageChange)}%
              </span>
            )}
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="text-purple-400" size={24} />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg">
              {filter === "7days"
                ? "7 DAYS"
                : filter === "30days"
                ? "30 DAYS"
                : "ALL TIME"}
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">Total Visits</p>
          <p className="text-4xl font-bold text-white">{totalVisits}</p>
        </div>

        {/* Total Projects */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <FolderKanban className="text-green-400" size={24} />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg">
              TOTAL
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">
            Total Projects
          </p>
          <p className="text-4xl font-bold text-white">{totalProjects}</p>
        </div>

        {/* Average Daily Visits */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-orange-400" size={24} />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg">
              AVG
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">Avg. Daily</p>
          <p className="text-4xl font-bold text-white">{avgVisitsPerDay}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        {/* Chart Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Traffic Trend</h2>
                <p className="text-sm text-gray-400">
                  Visitor analytics over time
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 bg-gray-700/30 p-1 rounded-xl border border-gray-600/30">
              <button
                onClick={() => handleFilterChange("7days")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "7days"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => handleFilterChange("30days")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "30days"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          ) : trafficData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(d) => {
                    const date = new Date(d);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  stroke="#4b5563"
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  stroke="#4b5563"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "#8b5cf6", fontWeight: "600" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorVisits)"
                  dot={{
                    r: 4,
                    fill: "#8b5cf6",
                    strokeWidth: 2,
                    stroke: "#1f2937",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#8b5cf6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-gray-500" size={32} />
                </div>
                <p className="text-gray-400 text-lg font-medium mb-2">
                  No data available
                </p>
                <p className="text-gray-500 text-sm">
                  Traffic data will appear here once visitors start arriving
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-400" size={16} />
            </div>
            <h3 className="text-sm font-semibold text-blue-400">Peak Day</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {trafficData.length > 0
              ? Math.max(...trafficData.map((d) => d.visits))
              : 0}{" "}
            visits
          </p>
          <p className="text-xs text-gray-400">
            {trafficData.length > 0
              ? trafficData.find(
                  (d) =>
                    d.visits === Math.max(...trafficData.map((t) => t.visits))
                )?.date || "N/A"
              : "No data"}
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-400" size={16} />
            </div>
            <h3 className="text-sm font-semibold text-purple-400">
              Active Days
            </h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {trafficData.filter((d) => d.visits > 0).length} days
          </p>
          <p className="text-xs text-gray-400">
            Out of {trafficData.length} days
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-green-400" size={16} />
            </div>
            <h3 className="text-sm font-semibold text-green-400">
              Engagement Rate
            </h3>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {trafficData.length > 0
              ? Math.round(
                  (trafficData.filter((d) => d.visits > 0).length /
                    trafficData.length) *
                    100
                )
              : 0}
            %
          </p>
          <p className="text-xs text-gray-400">Days with activity</p>
        </div>
      </div>
    </div>
  );
}
