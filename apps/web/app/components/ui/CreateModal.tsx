"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

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

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function CreateModal({ isOpen, onClose, title, children, size = "default" }: CreateModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;

      const focusableElements = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusableElements[0]!;
      const last = focusableElements[focusableElements.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("keydown", handleTabKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTabKey);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`bg-white w-full ${SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 id={headingId} className="font-serif text-[25px]">{title}</h2>
          <button
            ref={closeButtonRef}
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
