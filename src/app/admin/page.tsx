"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import Dashboard from "./components/Dashboard";
import {
  LogOut,
  PlusCircle,
  LayoutDashboard,
  List,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  devstack: string;
  link: string;
  git: string;
  image_url: string;
  created_at: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "list">(
    "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const PAGE_SIZE = 5;

  // 🔸 Cek login + role admin
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (!currentUser) return router.push("/login");
      if (currentUser.user_metadata?.role !== "admin") {
        alert("Unauthorized access");
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  // 🔸 Fetch project list (pagination)
  const fetchProjects = async (pageNum = 1) => {
    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("projects")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) console.error(error);
    else {
      setProjects(data || []);
      setTotalProjects(count || 0);
    }
  };

  useEffect(() => {
    if (!loading) fetchProjects(page);
  }, [loading, page]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1f2937] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );

  // 🔹 Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-[#1f2937]">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🧭 Enhanced Sidebar */}
      <aside
        className={`fixed md:static z-20 inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-72 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-400">Management Dashboard</p>
              </div>
            </div>
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-600/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("add");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "add"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            <PlusCircle size={20} />
            <span className="font-medium">Add Project</span>
            {activeTab === "add" && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("list");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "list"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            <List size={20} />
            <span className="font-medium">Project List</span>
            {activeTab === "list" && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
              Quick Stats
            </p>
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Total Projects</span>
                <span className="text-lg font-bold text-purple-400">
                  {totalProjects}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Menu Toggle */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-gray-800 hover:bg-gray-700 p-3 rounded-xl shadow-lg transition-colors border border-gray-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* 📦 Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span>Admin</span>
              <ChevronRight size={16} />
              <span className="text-purple-400 font-medium">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "add"
                  ? "Add Project"
                  : "Project List"}
              </span>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === "dashboard" && (
            <Dashboard
              userEmail={user?.email || ""}
              totalProjects={totalProjects}
            />
          )}

          {activeTab === "add" && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <PlusCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Add New Project
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Create a new project entry for your portfolio
                    </p>
                  </div>
                </div>
                <ProjectForm onProjectAdded={() => fetchProjects(page)} />
              </div>
            </div>
          )}

          {activeTab === "list" && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <List size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Project List
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Manage and edit your portfolio projects
                    </p>
                  </div>
                </div>
                <ProjectList
                  projects={projects}
                  onDelete={() => fetchProjects(page)}
                />

                {/* 🔹 Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-700/50 pt-6">
                    <div className="text-sm text-gray-400">
                      Showing{" "}
                      <span className="font-medium text-white">
                        {(page - 1) * PAGE_SIZE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-white">
                        {Math.min(page * PAGE_SIZE, totalProjects)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-white">
                        {totalProjects}
                      </span>{" "}
                      projects
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-600/50"
                      >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, idx, arr) => (
                            <>
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span
                                  key={`ellipsis-${p}`}
                                  className="text-gray-500 px-2"
                                >
                                  ...
                                </span>
                              )}
                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                  page === p
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600/50"
                                }`}
                              >
                                {p}
                              </button>
                            </>
                          ))}
                      </div>

                      <button
                        disabled={page === totalPages}
                        onClick={() =>
                          setPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-600/50"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
