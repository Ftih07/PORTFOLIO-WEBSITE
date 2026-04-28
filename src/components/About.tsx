"use client";
import React from "react";
import Image from "next/image";
import book from "../assets/book.png";
import pc from "../assets/pc.png";
import finance from "../assets/finance.png";

const About = () => {
  return (
    <div className="max-w-[1200px] mx-auto" id="about">
      <h1 className="text-white text-6xl max-w-[320px] mx-auto font-semibold p-4 mb-4">
        About <span className="text-orange-400">Me</span>
      </h1>

      <div className="px-6 md:p-0 grid md:grid-cols-8 gap-6 place-items-center">
        <div className="w-full md:col-span-4 relative bg-white/10 backdrop-blur-lg border-white/20 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-700 to-orange-800 opacity-30 animate-gradient-xy"></div>
          <div className="flex flex-row p-6">
            <Image src={book} alt="book" className="w-auto h-[130px]" />
            <div className="flex flex-col mt-4">
              <h2 className="text-2xl font-bold text-white/80">Education</h2>
              <p className="text-lg text-white/70 mt-2">
                Currently majoring in Software Engineering at SMK Telkom
                Purwokerto, where I continuously refine my logic and technical
                skills to solve complex programming challenges.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:col-span-4 relative bg-white/10 backdrop-blur-lg border-white/20 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-700 to-orange-800 opacity-30 animate-gradient-xy"></div>
          <div className="flex flex-row p-6">
            <Image
              src={finance}
              alt="experience"
              className="w-auto h-[130px]"
            />
            <div className="flex flex-col mt-4">
              <h2 className="text-2xl font-bold text-white/80">Experience</h2>
              <p className="text-lg text-white/70 mt-2">
                I have developed end-to-end digital solutions, ranging from
                comprehensive management systems to e-commerce platforms for
                real-world clients, focusing on efficiency and scalable backend
                architecture.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:col-span-8 relative bg-white/10 backdrop-blur-lg border-white/20 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-purple-700 to-orange-800 opacity-30 animate-gradient-xy"></div>
          <div className="flex flex-row p-6">
            <Image src={pc} alt="book" className="w-auto h-[130px]" />
            <div className="flex flex-col mt-4">
              <h2 className="text-2xl font-bold text-white/80">Skills</h2>
              <p className="text-lg text-white/70 mt-2">
                I specialize in web development using modern stacks. My core
                expertise includes PHP (Laravel ecosystem), JavaScript
                (Next.js/React), database management (SQL), and crafting
                intuitive UI/UX designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
