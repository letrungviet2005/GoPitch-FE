import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { getStoredLocation } from "../../../hooks/locationHandler";
import { chatWithAI } from "../../../services/aiService";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Chào bạn! Mình là **GoPitch AI**. Mình có thể giúp bạn tìm sân gần nhất, check giá hoặc hướng dẫn đặt sân.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    const userCoords = getStoredLocation();
    const latitude = userCoords?.lat || 0;
    const longitude = userCoords?.lng || 0;

    try {
      const reply = await chatWithAI(userMsg, latitude, longitude);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Xin lỗi, trợ lý AI đang gặp sự cố. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[380px] md:w-[450px] h-[600px] bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="p-5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
                  <Bot size={28} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-base tracking-wide">
                  GoPitch Assistant
                </h3>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <Zap size={10} /> AI thông minh sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fafc] dark:bg-slate-950/50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  } max-w-[85%]`}
                >
                  <div
                    className={`p-4 rounded-3xl text-[14px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        <ReactMarkdown
                          components={{
                            a: ({ href, ...props }) => {
                              const isInternal = href?.startsWith("/");
                              return (
                                <span
                                  onClick={() => {
                                    if (isInternal && href) {
                                      navigate(href);
                                    } else if (href) {
                                      window.open(href, "_blank");
                                    }
                                  }}
                                  className="text-blue-500 font-bold underline cursor-pointer hover:text-blue-700"
                                >
                                  {props.children}
                                </span>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-2">
                    {msg.role === "ai" ? "Trợ lý ảo" : "Bạn"}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập yêu cầu của bạn..."
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-700 dark:text-slate-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 ${
          isOpen
            ? "bg-slate-200 text-slate-600 rotate-90"
            : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
