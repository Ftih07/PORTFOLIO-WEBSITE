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
    return <p className="text-white text-center mt-24">Loading...</p>;

  // 🔹 Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalPages = Math.ceil(totalProjects / PAGE_SIZE);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* 🧭 Sidebar */}
      <aside
        className={`fixed md:static z-20 inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 bg-gray-800 p-6 flex flex-col justify-between`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-8 text-orange-400">
            Admin Panel
          </h2>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 p-2 rounded ${
                activeTab === "dashboard"
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-2 p-2 rounded ${
                activeTab === "add"
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <PlusCircle size={20} />
              Add Project
            </button>

            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 p-2 rounded ${
                activeTab === "list"
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <List size={20} />
              Project List
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded p-2 mt-6 font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* 📱 Mobile toggle */}
      <button
        className="absolute top-4 left-4 md:hidden z-30 bg-gray-800 p-2 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 📦 Main Content */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto ml-0 md:ml-0">
        {activeTab === "dashboard" && (
          <Dashboard
            userEmail={user?.email || ""}
            totalProjects={totalProjects}
          />
        )}

        {activeTab === "add" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
            <ProjectForm onProjectAdded={() => fetchProjects(page)} />
          </>
        )}

        {activeTab === "list" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Project List</h1>
            <ProjectList
              projects={projects}
              onDelete={() => fetchProjects(page)}
            />

            {/* 🔹 Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-4 py-1 bg-gray-800 rounded">
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
