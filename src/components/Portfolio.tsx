"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { ZoomIn, X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  devstack: string;
  link: string;
  image_url: string;
}

const ITEMS_PER_PAGE = 5;

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div
      className="text-white bg-gradient-to-b from-black to-[#381a5f] py-18 mt-52"
      id="portfolio"
    >
      {/* Title Section */}
      <h1 className="text-white text-6xl max-w-[320px] mx-auto font-semibold my-12">
        Project <span className="text-orange-400">Highlights</span>
      </h1>

      {/* Project List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage} // ini penting biar ada animasi transisi antar halaman
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="px-6 md:px-0 max-w-[1000px] mx-auto mt-40 space-y-24"
        >
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 75 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`mt-12 flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse gap-12" : "md:flex-row"
              }`}
            >
              {/* Left (text) */}
              <div className="space-y-2 max-w-[550px]">
                <h2 className="text-7xl my-4 text-white/70">
                  {`0${startIndex + index + 1}`}
                </h2>
                <p className="text-4xl">{project.title}</p>
                <p className="text-lg text-white/70 break-words p-4">
                  {project.description}
                </p>
                <p className="text-xl text-orange-400 font-semibold">
                  {project.devstack}
                </p>
                <div className="w-64 h-[1px] bg-gray-400 my-4"></div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  Link to Website
                </a>
              </div>

              {/* Image Section */}
              <div
                className="relative group flex justify-center items-center cursor-pointer"
                onClick={() => setSelectedImage(project.image_url)}
              >
                <Image
                  src={project.image_url}
                  alt={project.title}
                  width={500}
                  height={350}
                  className="h-[350px] w-[500px] object-cover border rounded border-gray-700 transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay + Icon */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex justify-center items-center">
                  <ZoomIn className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-gray-600 transition ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-500 hover:text-black"
            }`}
          >
            Prev
          </button>

          {/* Number Indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full flex justify-center items-center border ${
                  currentPage === i + 1
                    ? "bg-orange-500 border-orange-500 text-black font-semibold"
                    : "border-gray-500 text-gray-300 hover:border-orange-400 hover:text-orange-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border border-gray-600 transition ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-500 hover:text-black"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-2 hover:bg-black transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <Image
                src={selectedImage}
                alt="Project Preview"
                width={900}
                height={600}
                className="max-h-[90vh] w-auto object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
