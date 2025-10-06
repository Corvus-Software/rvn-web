"use client";

import { motion } from "framer-motion";
import { Cpu, Activity, MessageSquare, Repeat } from "lucide-react";

const steps = [
  {
    title: "Attach Device",
    description: "Connect Raven to your bike to start tracking every move.",
    icon: Cpu,
    color: "from-violet-500 via-blue-400 to-violet-400",
  },
  {
    title: "Ride the Track",
    description:
      "Raven monitors speed, lean angles, and braking precision in real-time.",
    icon: Activity,
    color: "from-blue-400 via-violet-500 to-blue-400",
  },
  {
    title: "Receive Feedback",
    description: "Get AI-powered coaching tailored to your riding style.",
    icon: MessageSquare,
    color: "from-violet-500 via-blue-400 to-violet-500",
  },
  {
    title: "Improve & Repeat",
    description:
      "Track progress, refine skills, and shave seconds off every lap.",
    icon: Repeat,
    color: "from-blue-400 via-violet-500 to-blue-400",
  },
];

const bikes = [
  { delay: 0, duration: 6 },
  { delay: 0, duration: 8 },
  { delay: 0, duration: 7 },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-16 md:py-24">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          id="bikePath"
          d="M 0 500 C 300 400, 800 700, 2000 300"
          stroke="gray"
          strokeWidth="4"
          strokeDasharray="15 15"
          fill="transparent"
          style={{ filter: "blur(3px)", opacity: 1 }}
        />
      </svg>
      {/* Bikes with smooth neon trails */}
      {bikes.map((bike, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: "-40px",
            left: "-1%",
            offsetPath: "path('M 0 500 C 300 400, 900 700, 2000 300')",
            offsetRotate: "auto",
          }}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: bike.duration,
            ease: "linear",
            delay: bike.delay,
          }}
        >
          <img
            src="/motorbike.png"
            width={120}
            className="relative z-10"
          />

          <div
            className="absolute h-1 rounded-full"
            style={{
              top: "120px",
              marginLeft: "-70px",
              width: "150px",
              background: "linear-gradient(to right, #953ce7ff, transparent)",
              filter: "blur(5px)",
              opacity: 0.6,
            }}
          />
        </motion.div>
      ))}
      {/* Section Title */}
      <div className="text-center mb-16 md:mb-24 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-violet-500 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl mt-4"
        >
          Follow these simple steps to elevate your riding performance.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center w-full max-w-6xl">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
              className="flex flex-col items-center p-4"
            >
              {/* Icon Circle */}
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr ${step.color} mb-6 shadow-lg`}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
