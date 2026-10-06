"use client";

import { useEffect, type ReactNode } from "react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "default" | "large";
}

const SIZE_CLASSES = {
  default: "max-w-lg",
  large: "max-w-4xl",
};

export function CreateModal({ isOpen, onClose, title, children, size = "default" }: CreateModalProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="font-serif text-[25px]">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="bg-[#f5f2eb] px-6 py-6">{children}</div>
      </div>
    </div>
  );
}