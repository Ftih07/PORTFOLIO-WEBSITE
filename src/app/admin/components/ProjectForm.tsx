"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
import {
  Upload,
  X,
  ExternalLink,
  Github,
  Code2,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface ProjectFormProps {
  onProjectAdded: () => void;
}

export default function ProjectForm({ onProjectAdded }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    devstack: "",
    link: "",
    git: "",
    image_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 🔹 Generate preview URL saat file berubah
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.image_url;

    // 🔸 Upload file jika ada
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      // 🔹 Dapatkan public URL
      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // 🔸 Simpan ke tabel
    const { error } = await supabase.from("projects").insert([
      {
        ...formData,
        image_url: imageUrl,
      },
    ]);

    if (error) alert("Failed to add project: " + error.message);
    else {
      setFormData({
        title: "",
        description: "",
        devstack: "",
        link: "",
        git: "",
        image_url: "",
      });
      setFile(null);
      setPreview(null);
      onProjectAdded();
    }

    setLoading(false);
  }

  // 🔸 Handle drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields */}
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Sparkles size={16} className="text-purple-400" />
            Project Title
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="My Awesome Project"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FileText size={16} className="text-blue-400" />
            Description
          </label>
          <textarea
            placeholder="Tell us about your project..."
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px] resize-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Code2 size={16} className="text-green-400" />
            Tech Stack
          </label>
          <input
            type="text"
            placeholder="React, Next.js, Tailwind CSS (comma separated)"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={formData.devstack}
            onChange={(e) =>
              setFormData({ ...formData, devstack: e.target.value })
            }
          />
          <p className="text-xs text-gray-500">
            Separate multiple technologies with commas
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live Link */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <ExternalLink size={16} className="text-blue-400" />
              Live Demo URL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-10"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
              <ExternalLink
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* GitHub Link */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Github size={16} className="text-gray-400" />
              GitHub Repository
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://github.com/user/repo"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-10"
                value={formData.git}
                onChange={(e) =>
                  setFormData({ ...formData, git: e.target.value })
                }
              />
              <Github
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <ImageIcon size={16} className="text-purple-400" />
            Project Image
          </label>

          {/* Drag & Drop Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? "border-purple-400 bg-purple-400/10 scale-[1.02]"
                : "border-gray-600 hover:border-gray-500 bg-gray-700/30"
            }`}
          >
            <Upload
              size={48}
              className={`mx-auto mb-4 transition-colors ${
                isDragging ? "text-purple-400" : "text-gray-400"
              }`}
            />

            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-400">
                  <ImageIcon size={20} />
                  <p className="font-medium">{file.name}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-300 font-medium mb-2">
                  Drag & drop your image here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click the button below to browse
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all cursor-pointer font-medium"
            >
              <Upload size={18} />
              Browse Files
            </label>

            <p className="text-xs text-gray-500 mt-3">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-lg animate-[fadeIn_0.3s_ease-out]">
              <Image
                src={preview}
                alt="Preview"
                width={800}
                height={450}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="w-10 h-10 bg-red-500/90 hover:bg-red-500 backdrop-blur-lg rounded-lg flex items-center justify-center text-white transition-all shadow-lg hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  ✓ Image ready to upload
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-700/50">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding Project...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Add Project</span>
            </>
          )}
        </button>

        {loading && (
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-sm text-blue-400 text-center flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              Uploading image and saving project data...
            </p>
          </div>
        )}
      </div>

      {/* Helper Info */}
      <div className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Quick Tips
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Use a descriptive title that represents your project</li>
          <li>• Add multiple tech stacks separated by commas</li>
          <li>• High-quality images make your portfolio stand out</li>
          <li>• Include both live demo and GitHub links when available</li>
        </ul>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </form>
  );
}
