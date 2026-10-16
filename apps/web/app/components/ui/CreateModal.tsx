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
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function CreateModal({ isOpen, onClose, title, children, size = "default" }: CreateModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const headingId = useId();

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;

      const focusableElements = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
        .filter((element) => !element.matches(":disabled") && element.getClientRects().length > 0);
      if (focusableElements.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }

      const first = focusableElements[0]!;
      const last = focusableElements[focusableElements.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && (active === last || !root.contains(active))) {
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
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={headingId}
        className={`bg-white w-full min-w-0 ${SIZE_CLASSES[size]} max-h-[90dvh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-neutral-200 sm:px-6">
          <h2 id={headingId} className="min-w-0 break-words font-serif text-[25px]">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center text-neutral-500 hover:text-black text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="bg-[#f5f2eb] px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
