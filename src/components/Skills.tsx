import React from "react";
import { FaHtml5, FaReact, FaJsSquare, FaPython } from "react-icons/fa";
import { SiCsharp, SiFlutter, SiLaravel, SiNextdotjs } from "react-icons/si";

const skillIcons = [
  { icon: <FaHtml5 size={140} />, label: "HTML" },
  { icon: <SiCsharp size={140} />, label: "C#" },
  { icon: <FaReact size={110} />, label: "React" },
  { icon: <FaJsSquare size={140} />, label: "JavaScript" },
  { icon: <SiLaravel size={140} />, label: "Laravel" },
  { icon: <SiNextdotjs size={140} />, label: "NextJs" },
  { icon: <SiFlutter size={110} />, label: "Flutter" },
  { icon: <FaPython size={140} />, label: "Python" },
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
              className="h-[160px] w-[160px] md:h-[220px] md:w-[220px] flex flex-col justify-between items-center bg-white/10 p-4 rounded-xl"
            >
              {skill.icon}
              <p className="mt-2">{skill.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
