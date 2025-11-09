"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
import { Eye, Trash2 } from "lucide-react";

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
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={() => {
          setSelectedProject(null);
          setIsEditing(false);
        }}
      >
        <div
          className="bg-gray-800 rounded-lg p-6 max-w-lg w-full relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setSelectedProject(null);
              setIsEditing(false);
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            ✕
          </button>

          {!isEditing ? (
            <>
              <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
              <p className="text-gray-400 mb-2">{p.devstack}</p>

              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.title}
                  width={500}
                  height={300}
                  className="rounded mb-3 object-cover"
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <p className="text-gray-300 mb-3">{p.description}</p>

              <div className="space-x-2 mb-4">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    className="text-orange-400 hover:underline"
                  >
                    🔗 Live
                  </a>
                )}
                {p.git && (
                  <a
                    href={p.git}
                    target="_blank"
                    className="text-orange-400 hover:underline"
                  >
                    🧠 GitHub
                  </a>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setEditData(p);
                    setPreview(p.image_url || "");
                    setIsEditing(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>

              <div className="flex flex-col gap-2">
                <input
                  className="p-2 bg-gray-700 rounded"
                  value={editData?.title ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev!, title: e.target.value }))
                  }
                  placeholder="Title"
                />
                <textarea
                  className="p-2 bg-gray-700 rounded"
                  value={editData?.description ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                />
                <input
                  className="p-2 bg-gray-700 rounded"
                  value={editData?.devstack ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev!,
                      devstack: e.target.value,
                    }))
                  }
                  placeholder="Tech Stack"
                />
                <input
                  className="p-2 bg-gray-700 rounded"
                  value={editData?.link ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev!, link: e.target.value }))
                  }
                  placeholder="Live Link"
                />
                <input
                  className="p-2 bg-gray-700 rounded"
                  value={editData?.git ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev!, git: e.target.value }))
                  }
                  placeholder="GitHub Link"
                />
              </div>

              {/* Upload & Preview */}
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
                className={`border-2 border-dashed rounded p-6 text-center mt-4 transition ${
                  isDragging
                    ? "border-orange-400 bg-orange-400/10"
                    : "border-gray-600"
                }`}
              >
                <p className="text-gray-400 mb-2">
                  {file
                    ? `📁 ${file.name}`
                    : "Drag & drop image here, or click to select"}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const uploadedFile = e.target.files?.[0];
                    if (uploadedFile) {
                      setFile(uploadedFile);
                      setPreview(URL.createObjectURL(uploadedFile));
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-orange-400 hover:underline"
                >
                  Browse Files
                </label>
              </div>

              {preview && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={400}
                    height={250}
                    className="rounded border border-gray-600 object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (projects.length === 0)
    return <p className="text-gray-400 text-center">No projects found.</p>;

  return (
    <div className="space-y-4">
      {projects.map((proj) => (
        <div
          key={proj.id}
          className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition"
        >
          <div className="flex-1 cursor-pointer">
            <h3 className="text-lg font-semibold">{proj.title}</h3>
            <p className="text-sm text-gray-400">{proj.devstack}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProject(proj)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <button
              onClick={() => deleteProject(proj.id)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      ))}

      {renderModal()}
    </div>
  );
}
