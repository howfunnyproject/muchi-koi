"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3200);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "clamp(24px, 5vh, 40px)",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "12px"})`,
        background: "var(--card2)",
        border: "1px solid var(--border2)",
        color: "var(--text)",
        padding: "11px 22px",
        borderRadius: 50,
        fontSize: "0.82rem",
        fontWeight: 500,
        zIndex: 99999,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.28s, transform 0.28s",
        whiteSpace: "nowrap",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        maxWidth: "90vw",
        textAlign: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      {message}
    </div>
  );
}

// Global toast manager
let _showToast: ((msg: string) => void) | null = null;

export function registerToast(fn: (msg: string) => void) {
  _showToast = fn;
}

export function showToast(msg: string) {
  _showToast?.(msg);
}
