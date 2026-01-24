"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/8801716840429"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 sm:right-8 z-40 h-14 w-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer text-white active:scale-95 group"
    >
      <MessageCircle className="h-8 w-8 fill-current" />
      <span className="absolute right-16 bg-black/80 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        WhatsApp Support
      </span>
    </a>
  );
}
