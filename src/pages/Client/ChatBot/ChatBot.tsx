import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Zap } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom"; // Import navigate
import { getStoredLocation } from "../../../hooks/locationHandler";

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
      text: "Chào bạn! Mình là **GoPitch AI**. Mình có thể giúp bạn tìm sân gần nhất và nhanh nhất, check giá hoặc đặt sân chỉ trong 1 nốt nhạc. bạn muốn đá sân nào hôm nay?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Hook điều hướng

  // Tự động cuộn xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    const userCoords = getStoredLocation();
    const latitude = userCoords?.lat || 0;
    const longitude = userCoords?.lng || 0;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/ai/chat",
        { message: userMsg, lat: latitude, lng: longitude },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: response.data.reply },
        ]);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Xin lỗi bạn bộ não AI đang bị quá tải (429). Bạn đợi 30s rồi hỏi lại nhé!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="mb-4 w-[380px] md:w-[450px] h-[600px] bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header - Gradient cực cháy */}
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

          {/* Nội dung tin nhắn */}
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
                            // Xử lý navigate để không reload trang, không mất Token
                            a: ({ node, href, ...props }) => {
                              const isInternal = href?.startsWith("/");
                              return (
                                <span
                                  onClick={() => {
                                    if (isInternal && href) {
                                      navigate(href); // Chuyển trang mượt mà
                                      // setIsOpen(false); // Tùy chọn: Đóng chat khi click link
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

          {/* Input nhập liệu - Thiết kế hiện đại */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập yêu cầu của đại ca..."
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
            <p className="text-[9px] text-center text-slate-400 mt-2">
              GoPitch AI có thể nhầm lẫn, hãy kiểm tra lại thông tin sân nhé!
            </p>
          </div>
        </div>
      )}

      {/* Nút bấm nổi (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 ${
          isOpen
            ? "bg-slate-200 text-slate-600 rotate-90"
            : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white"></span>
            </span>
            {/* Tooltip khi hover */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat với GoPitch AI
            </div>
          </>
        )}
      </button>
    </div>
  );
}
