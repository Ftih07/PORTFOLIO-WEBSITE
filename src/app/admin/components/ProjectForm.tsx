"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";

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
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-10">
      <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="p-2 bg-gray-700 rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="p-2 bg-gray-700 rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Dev Stack"
          className="p-2 bg-gray-700 rounded"
          value={formData.devstack}
          onChange={(e) =>
            setFormData({ ...formData, devstack: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Live Link"
          className="p-2 bg-gray-700 rounded"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <input
          type="text"
          placeholder="GitHub Link"
          className="p-2 bg-gray-700 rounded"
          value={formData.git}
          onChange={(e) => setFormData({ ...formData, git: e.target.value })}
        />

        {/* 🖼️ Drag & Drop Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded p-6 text-center transition ${
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
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-orange-400 hover:underline"
          >
            Browse Files
          </label>
        </div>

        {/* 🖼️ Image Preview */}
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

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 rounded p-2 font-semibold mt-4"
        >
          {loading ? "Saving..." : "Add Project"}
        </button>
      </div>
    </form>
  );
}
