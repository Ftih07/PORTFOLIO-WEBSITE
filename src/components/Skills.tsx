"use client";

import React from "react";
import { FaReact, FaJsSquare, FaPython, FaPhp } from "react-icons/fa";
import { SiLaravel, SiMysql, SiNextdotjs, SiVuedotjs } from "react-icons/si";

const skillIcons = [
  // --- FRONTEND ---
  { icon: <FaJsSquare size={140} />, label: "JavaScript", color: "#F7DF1E" }, // kuning JS
  { icon: <FaReact size={140} />, label: "React", color: "#61DAFB" }, // biru React
  { icon: <SiNextdotjs size={140} />, label: "Next.js", color: "#000000" }, // hitam Next.js
  { icon: <SiVuedotjs size={140} />, label: "Vue.js", color: "#4FC08D" }, // hijau Vue

  // --- BACKEND & DATABASE ---
  { icon: <FaPhp size={140} />, label: "PHP", color: "#777BB4" }, // ungu PHP
  { icon: <SiLaravel size={140} />, label: "Laravel", color: "#FF2D20" }, // merah Laravel
  { icon: <FaPython size={140} />, label: "Python", color: "#3776AB" }, // biru Python
  { icon: <SiMysql size={140} />, label: "MySQL", color: "#4479A1" }, // biru MySQL
];

const Skills = () => {
  return (
    <div className="bg-[linear-gradient(to_top,#000,#381a5f_80%)] py-32">
      <div className="text-white w-[400px] md:min-w-[950px] mx-auto p-8 text-center">
        <h2 className="text-6xl font-bold mb-10">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skillIcons.map((skill, index) => (
            <div
              key={index}
              className="h-[160px] w-[160px] md:h-[220px] md:w-[220px] flex flex-col justify-between items-center bg-white/10 p-4 rounded-xl transition-transform duration-300 hover:scale-110"
            >
              <div
                className="text-white transition-colors duration-300"
                style={{
                  color: skill.color,
                  filter: "grayscale(100%)",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "none")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter = "grayscale(100%)")
                }
              >
                {skill.icon}
              </div>
              <p className="mt-2">{skill.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
