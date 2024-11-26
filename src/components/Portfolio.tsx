"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import proj1 from "../assets/aline-admin.jpg"
import proj2 from "../assets/aline-store.jpg"
import proj3 from "../assets/antonov-company.jpg"
import proj4 from "../assets/b11ngym.jpg"
import proj5 from "../assets/kinggym.jpg"
import proj6 from "../assets/zestify.jpg"
import proj7 from "../assets/naltlan-dealer.jpg"
import proj8 from "../assets/antonov.jpg"



const projects = [
  {
    title: "Apotek Online - Aline Admin",
    desc: "When I was in the 10th grade, I was given a final project for my project for the DPK-A subject, I made anOnline Pharmacy website called Aline which is specifically for the “Admin” section and this website I created using Next js and NeonDB as the database database",
    devstack: "Next Js, NeonDB, Clerk, Cloudinary, Tailwind-css",
    link: "https://aline-admin.vercel.app/",
    git: "#",
    src: proj1,
  },
  {
    title: "Apotek Online - Aline Store",
    desc: "Still the same as the previous project only it's just that this website is specifically for the “Store” section or for the section seen by buyers and This website is interconnected between Admin and Store",
    devstack: "Next Js, React, Stripe, Tailwind-css",
    link: "https://aline-store-seven.vercel.app/",
    git: "#",
    src: proj2,
  },
  {
    title: "Antonov Company",
    desc: "For the website that I just finished working on there is a Company Profile website called Antonov Company. I made this website for Midterm Assessment of MK3A subject. This website still uses simple/basic HTML, CSS, and JavaScript which is simple / basic",
    devstack: "HTML, CSS, JavaScript",
    link: "https://mk-3-a-antonov-company.vercel.app/",
    git: "#",
    src: proj3,
  },
  {
    title: "B11N GYM Purwokerto",
    desc: "For this website is still unfinished or still not 100% finished and I made this website using Next js. I made this website for promotional needs, selling members of my parents' gym gym members, and also at the same time to work on PKK-A and PKK-B portfolio assignments",
    devstack: "Next Js, React, Tailwind-css",
    link: "https://b11-n-gym-website.vercel.app/",
    git: "#",
    src: proj4,
  },
  {
    title: "K1NG GYM Purwokerto",
    desc: "This website is still unfinished or not 100% finished and I made a website for my parent's promotional needs.",
    devstack: "Next Js, React, Tailwind-css",
    link: "https://k1-ng-gym-website.vercel.app/",
    git: "#",
    src: proj5,
  },
  {
    title: "Zestify",
    desc: "Zestify UI/UX Design was created for the UI/UX Fast 2024 competition held this November, showcasing innovative and user-focused design solutions tailored to modern digital experiences.",
    devstack: "Figma",
    link: "https://www.figma.com/design/M9zLQN9iOlE6OEJgAxL7gM/Zestify?node-id=0-1&node-type=canvas&t=E9KuzdJhaa6OUIfI-0",
    git: "#",
    src: proj6,
  },
  {
    title: "Naltlan Dealer",
    desc: "The Naltlan Dealer UI/UX design was a project I created as part of my class promotion assignment during my 10th grade. It highlights my early exploration of user-focused design principles and creativity in developing functional and visually appealing interfaces.",
    devstack: "Figma",
    link: "https://www.figma.com/design/1vQMXWlVLuBPaAjeXVNV5e/DPK-B?node-id=0-1&t=DDB4Qdk6cb4CGUNh-1",
    git: "#",
    src: proj7,
  },
  {
    title: "Antonov Company - UI/UX",
    desc: "The Antonov Company UI/UX design was a project I developed as part of my mid-semester 1 assignment during 10th grade. This work reflects my foundational skills in creating user-centered and aesthetically pleasing designs early in my learning journey.",
    devstack: "Figma",
    link: "https://www.figma.com/design/SR6xh7FmZseVne42hCB3Tz/Figma---Antonov-Company---DPK-D?node-id=0-1&t=DBzceHXpyF9jB7yS-1",
    git: "#",
    src: proj8,
  },
];
const Portfolio = () => {
  return (
    <div
      className="text-white bg-gradient-to-b from-black to-[#381a5f] py-18 mt-52"
      id="portfolio"
    >
      <h1 className="text-white text-6xl max-w-[320px] mx-auto font-semibold my-12">
        Project <span className="text-orange-400">Highlights</span>
      </h1>
      <div className="px-6 md:px-0 max-w-[1000px] mx-auto mt-40 space-y-24">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 75 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`mt-12 flex flex-col ${
              index % 2 === 1 ? "md:flex-row-reverse gap-12" : "md:flex-row"
            }`}
          >
            <div className="space-y-2 max-w-[550px]">
              <h2 className="text-7xl my-4 text-white/70">{`0${index + 1}`}</h2>
              <p className="text-4xl">{project.title}</p>
              <p className="text-lg text-white/70 break-words p-4">
                {project.desc}
              </p>
              <p className="text-xl text-orange-400 font-semibold">
                {project.devstack}
              </p>
              <div className="w-64 h-[1px] bg-gray-400 my-4"></div>
              <a href={project.link} target="_blank" rel="noopener noreferrer">Link to Website</a>
            </div>

            <div className="flex justify-center items-center">
              <Image
                src={project.src}
                alt={project.title}
                className="h-[350px] w-[500px] object-cover border rounded border-gray-700"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
