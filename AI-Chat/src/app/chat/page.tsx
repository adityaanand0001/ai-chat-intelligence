"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useChat } from "@/context/ChatContext";
import MessageList from "@/components/MessageList";
import InputBox from "@/components/InputBox";

const QUICK_TIPS = [
  "Analyze sentiment",
  "Extract intent",
  "Stream responses",
  "Switch sessions",
];

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const { messages, isLoading, sendMessage, loadSession, sessionId } = useChat();

  useEffect(() => {
    if (sessionParam && sessionParam !== sessionId) {
      loadSession(sessionParam);
    }
  }, [sessionParam]);

  useEffect(() => {
    if (!sessionParam && messages.length === 0 && !isLoading) {
      router.replace("/");
    }
  }, [sessionParam, messages, isLoading, router]);

  if (messages.length === 0 && isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-[#E07B39]"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-500 text-[14px] font-medium tracking-tight"
        >
          Loading conversation...
        </motion.p>
      </div>
    );
  }

  if (messages.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <MessageList messages={messages} isLoading={isLoading} />
      <div className="flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pb-2">
          <InputBox onSend={sendMessage} disabled={isLoading} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-4 md:px-8 pb-4 flex items-center justify-center gap-4 flex-wrap"
        >
          {QUICK_TIPS.map((tip) => (
            <motion.button
              key={tip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => sendMessage(tip)}
              className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors duration-200 cursor-pointer"
            >
              {tip}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
