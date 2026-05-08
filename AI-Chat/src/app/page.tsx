"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChat } from "@/context/ChatContext";
import InputBox from "@/components/InputBox";
import TextType from "@/components/TextType";

const TEXT_CYCLE = [
  "Detects intent & sentiment",
  "Streams responses word-by-word",
  "Remembers conversation history",
  "Powered by Gemini 2.5 Flash",
  "Configure your own API key",
  "Works offline with smart fallback",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  const router = useRouter();
  const { createSession, sendMessage, isLoading } = useChat();

  const [isNavigating, setIsNavigating] = useState(false);

  const handleSend = async (text: string) => {
    setIsNavigating(true);
    const sid = await createSession();
    sendMessage(text, sid);
    router.push(`/chat?session=${sid}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 -mt-12 w-full max-w-3xl"
      >
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <motion.h1
            variants={itemVariants}
            className="text-[32px] md:text-[40px] tracking-tight leading-tight"
          >
            <span className="text-[#1d1d1f] font-medium">What can I</span>{" "}
            <span className="text-[#E07B39] font-normal">help</span>{" "}
            <span className="text-[#1d1d1f] font-medium">with?</span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="text-[15px] md:text-[16px] text-[#6F6B65] font-normal min-h-[26px]"
          >
            <TextType
              texts={TEXT_CYCLE}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2200}
              cursorCharacter="|"
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="w-full h-[56px] flex items-center justify-center">
          {isNavigating ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-[#E07B39]"
            >
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span className="text-[14px] font-medium tracking-tight">Starting conversation...</span>
            </motion.div>
          ) : (
            <div className="w-full h-full">
              <InputBox onSend={handleSend} disabled={isLoading || isNavigating} />
            </div>
          )}
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-[12px] text-neutral-400 text-center mt-10 select-none"
        >
          Chatbot can make mistakes. Verify important information.
        </motion.p>
      </motion.div>
    </div>
  );
}
