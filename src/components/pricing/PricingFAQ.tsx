"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards, PayPal, and Apple/Google Pay for seamless checkout.",
  },
  {
    question: "Is RVN a one-time purchase or subscription?",
    answer:
      "No, The RVN device is a one-time purchase but the software access is subscription-based.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use end-to-end encryption and follow industry best practices to protect your telemetry and profile data.",
  },
  {
    question: "Can I track multiple bikes?",
    answer:
      "Not yet, but it's on our roadmap! Currently, each account supports one bike profile.",
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-20 px-6 flex flex-col items-center">
      {/* Section Title */}
      <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-violet-500 bg-clip-text text-transparent mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl text-center">
        Answers to common questions about RVN and our pricing plans.
      </p>

      {/* FAQ Accordion */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = index === openIndex;
          
          return (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-[0_5px_20px_rgba(138,43,226,0.3)] cursor-pointer overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="flex justify-between items-center px-6 py-4"
                onClick={() => toggleIndex(index)}
              >
                <h3 className="text-white text-lg md:text-xl font-semibold">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-violet-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Answer */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-4 text-gray-300 text-sm md:text-base"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
