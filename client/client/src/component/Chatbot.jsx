import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { MdSend, MdMic, MdSmartToy } from "react-icons/md";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your DrowsiShield AI assistant. I'm here to monitor your alerts and answer any questions." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response delay
    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: "I am processing your request. Connection to AI core is establishing..."
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 bg-white border-b border-gray-100 shadow-sm shrink-0">
        <div className="relative">
          <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-md flex items-center justify-center text-white">
            <MdSmartToy size={28} />
          </div>
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">AI Assistant</h2>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={sendMessage} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all shadow-sm">
          <button type="button" className="pl-4 pr-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MdMic size={22} />
          </button>
          
          <input
            type="text"
            className="flex-1 py-3.5 px-2 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-[15px]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="pr-2">
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                input.trim() 
                  ? "bg-black text-white hover:scale-105 active:scale-95 shadow-md" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <MdSend size={18} className="translate-x-[1px]" />
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-gray-400 font-medium tracking-wide">AI CAN MAKE MISTAKES. VERIFY CRITICAL ALERTS.</p>
        </div>
      </div>
    </div>
  );
}