"use client";

import NavBar from "@/components/NavBar";
import { motion, easeOut} from "framer-motion";
import Image from "next/image";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: easeOut },
  },
});


export default function AboutPage() {

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Neon fades (same as HomePage) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(138,43,226,0.15),transparent_60%)] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,191,255,0.15),transparent_60%)] z-0" />

      {/* Fixed navbar */}
      <div className="fixed top-4 left-0 w-full z-50 flex justify-center">
        <NavBar />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-28">
          <motion.h1
            {...fadeUp(0)}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            About{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              RVN
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed"
          >
            We are redefining racing performance through data, technology, and
            passion. Our mission is simple: help drivers push beyond their
            limits.
          </motion.p>
        </section>

        {/* Mission / Vision / Values */}
        <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Our Mission",
              desc: "Empower racers and teams with accurate insights and tools that drive improvement lap after lap.",
            },
            {
              title: "Our Vision",
              desc: "Create the future of motorsport analytics by blending performance data with cutting-edge technology.",
            },
            {
              title: "Our Values",
              desc: "Precision, innovation, and passion. These principles guide everything we design and build.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.2 * i)}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg hover:shadow-purple-500/20 transition"
            >
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {item.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Team Section */}
        <section className="px-6 py-20 max-w-6xl mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-4xl md:text-5xl font-bold mb-12"
          >
            Meet the{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Team
            </span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-10">
            {[
              {
                name: "Zabih Yousuf",
                role: "Founder & CEO",
                img: "/zabih.jfif",
                class: "w-24 h-24",
              },
              {
                name: "Asad Yousuf",
                role: "Founder",
                img: "/asad.jpg",
                class: "w-24 h-24",
              },
              {
                name: "Jalila Yousuf",
                role: "Lead Software Engineer",
                img: "/jalila.jpeg",
                class: "w-24 h-24",
              },
              {
                name: "Zayd Asif",
                role: "Software Engineer",
                img: "/zayd.png",
                class: "w-24 h-48",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.2 * i)}
                className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition"
              >
                <Image
                  src={member.img ?? "/default-profile.png"}
                  alt="pfp"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
