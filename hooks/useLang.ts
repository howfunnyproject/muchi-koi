"use client";
import { useState, useEffect } from "react";
import { Lang } from "@/lib/translations";

export function useLang() {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = localStorage.getItem("muchi-koi-lang") as Lang | null;
    if (saved === "en" || saved === "bn") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("muchi-koi-lang", l);
  }

  return { lang, setLang };
}
