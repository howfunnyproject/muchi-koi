"use client";
import { Lang } from "@/lib/translations";
import T from "@/lib/translations";

interface HeaderProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export function Header({ lang, setLang }: HeaderProps) {
  const t = T[lang];
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-name">Muchi Koi</span>
        <span className="logo-tag">{t.logoTag}</span>
      </div>
      <div className="lang-pill">
        <button
          className={`lang-btn${lang === "en" ? " active" : ""}`}
          onClick={() => setLang("en")}
        >
          EN
        </button>
        <button
          className={`lang-btn${lang === "bn" ? " active" : ""}`}
          onClick={() => setLang("bn")}
        >
          বাং
        </button>
      </div>
    </header>
  );
}
