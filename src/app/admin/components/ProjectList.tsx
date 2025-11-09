"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
import {
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  Github,
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Code2,
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

interface ProjectListProps {
  projects: Project[];
  onDelete: () => void;
}

export default function ProjectList({ projects, onDelete }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // 🗑️ Delete project
  async function deleteProject(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) alert("Failed to delete: " + error.message);
    else onDelete();
  }

  // 💾 Save edited project + upload image
  async function saveEdit() {
    if (!editData) return;
    setLoading(true);

    let imageUrl = editData.image_url;

    // Upload new image if exists
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // Update project data
    const { error } = await supabase
      .from("projects")
      .update({
        title: editData.title,
        description: editData.description,
        devstack: editData.devstack,
        link: editData.link,
        git: editData.git,
        image_url: imageUrl,
      })
      .eq("id", editData.id);

    if (error) alert("Failed to update project: " + error.message);
    else {
      setIsEditing(false);
      setSelectedProject(null);
      setFile(null);
      setPreview("");
      onDelete();
    }

    setLoading(false);
  }

  // 🪟 Modal tampil detail & edit
  const renderModal = () => {
    if (!selectedProject) return null;
    const p = selectedProject;

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
        onClick={() => {
          setSelectedProject(null);
          setIsEditing(false);
          setFile(null);
          setPreview("");
        }}
      >
        <div
          className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full relative overflow-hidden animate-[scaleIn_0.3s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative">
            <button
              onClick={() => {
                setSelectedProject(null);
                setIsEditing(false);
                setFile(null);
                setPreview("");
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center text-white transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
                {isEditing ? (
                  <Edit3 className="text-white" size={24} />
                ) : (
                  <Eye className="text-white" size={24} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? "Edit Project" : p.title}
                </h2>
                <p className="text-purple-100 text-sm">
                  {isEditing ? "Update project information" : p.devstack}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Project Image */}
                {p.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      width={800}
                      height={450}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-700/50 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-600">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <p className="text-sm">No Image Available</p>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 size={16} />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 size={16} />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {p.devstack.split(",").map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium border border-purple-500/20"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/20"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {p.git && (
                    <a
                      href={p.git}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all border border-gray-600"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Created Date */}
                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Calendar size={14} />
                    Created: {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      setEditData(p);
                      setPreview(p.image_url || "");
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <Edit3 size={18} />
                    Edit Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Form Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Project Title
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={editData?.title ?? ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev!,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter project title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px] resize-none"
                    value={editData?.description ?? ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your project"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Tech Stack
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={editData?.devstack ?? ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev!,
                        devstack: e.target.value,
                      }))
                    }
                    placeholder="React, Next.js, Tailwind (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Live Demo URL
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={editData?.link ?? ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev!,
                          link: e.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      GitHub URL
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={editData?.git ?? ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev!,
                          git: e.target.value,
                        }))
                      }
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Project Image
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const uploadedFile = e.dataTransfer.files?.[0];
                      if (uploadedFile) {
                        setFile(uploadedFile);
                        setPreview(URL.createObjectURL(uploadedFile));
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? "border-purple-400 bg-purple-400/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <Upload
                      className={`mx-auto mb-4 ${
                        isDragging ? "text-purple-400" : "text-gray-400"
                      }`}
                      size={48}
                    />
                    <p className="text-gray-400 mb-2">
                      {file ? (
                        <span className="text-purple-400 font-medium">
                          📁 {file.name}
                        </span>
                      ) : (
                        "Drag & drop image here, or click to browse"
                      )}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="file-upload-edit"
                      onChange={(e) => {
                        const uploadedFile = e.target.files?.[0];
                        if (uploadedFile) {
                          setFile(uploadedFile);
                          setPreview(URL.createObjectURL(uploadedFile));
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload-edit"
                      className="inline-block cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
                    >
                      Browse Files
                    </label>
                  </div>

                  {/* Image Preview */}
                  {preview && (
                    <div className="mt-4 relative rounded-xl overflow-hidden border border-gray-700/50">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={800}
                        height={450}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => {
                            setFile(null);
                            setPreview(editData?.image_url || "");
                          }}
                          className="w-8 h-8 bg-red-500/80 hover:bg-red-500 backdrop-blur-lg rounded-lg flex items-center justify-center text-white transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFile(null);
                      setPreview("");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold transition-all border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (projects.length === 0)
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="text-gray-500" size={40} />
        </div>
        <p className="text-gray-400 text-lg font-medium mb-2">
          No projects found
        </p>
        <p className="text-gray-500 text-sm">
          Start by adding your first project
        </p>
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-5 rounded-xl hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Project Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Code2 className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {proj.devstack}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      {new Date(proj.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-medium transition-all border border-blue-500/20 hover:border-blue-500/40"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-all border border-red-500/20 hover:border-red-500/40"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderModal()}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
