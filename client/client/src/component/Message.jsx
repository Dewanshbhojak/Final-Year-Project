import React from "react";
import { MdPerson, MdSmartToy } from "react-icons/md";

export default function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md border-2 ${
          isUser ? "bg-black text-white border-gray-100" : "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-emerald-100"
        }`}>
          {isUser ? <MdPerson size={20} /> : <MdSmartToy size={20} />}
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-3.5 text-[15px] shadow-sm flex flex-col justify-center
          ${isUser 
            ? "bg-black text-white rounded-2xl rounded-tr-sm" 
            : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
          }`}
        >
          <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>

      </div>
    </div>
  );
}