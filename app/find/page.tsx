"use client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";
import { Header } from "@/components/Header";
import { AddModal } from "@/components/AddModal";
import { CobblerList } from "@/components/CobblerList";
import { useLang } from "@/hooks/useLang";
import { useCobblers } from "@/hooks/useCobblers";
import { useGeolocation } from "@/hooks/useGeolocation";
import T from "@/lib/translations";
import { Cobbler } from "@/lib/types";
import { haversineDistance } from "@/lib/utils";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface)",
        color: "var(--text3)",
        fontSize: "0.9rem",
        gap: 10,
      }}
    >
      <div className="loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
      Loading map…
    </div>
  ),
});

export default function FindPage() {
  const router = useRouter();
  const { lang, setLang } = useLang();
  const { cobblers, loading, addOptimistic } = useCobblers();
  const { location, locating, locate } = useGeolocation();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const mapRef = useRef<LeafletMap | null>(null);
  const t = T[lang];

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function handleLocate() {
    showToast(t.locating);
    const loc = await locate();
    if (!loc) {
      showToast(t.locFail);
      return;
    }
    // Pan map to nearest cobbler
    if (mapRef.current && filtered.length > 0) {
      const sorted = [...filtered].sort(
        (a, b) =>
          haversineDistance(loc.lat, loc.lng, a.lat, a.lng) -
          haversineDistance(loc.lat, loc.lng, b.lat, b.lng)
      );
      if (sorted[0]) {
        setTimeout(() => {
          mapRef.current?.setView([sorted[0].lat, sorted[0].lng], 16);
        }, 800);
      }
    }
  }

  // Filter cobblers by search query
  const filtered = cobblers
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.area || "").toLowerCase().includes(q) ||
        c.services.some((s) => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (!location) return 0;
      return (
        haversineDistance(location.lat, location.lng, a.lat, a.lng) -
        haversineDistance(location.lat, location.lng, b.lat, b.lng)
      );
    });

  function handleAddSuccess(cobbler: Cobbler) {
    addOptimistic(cobbler);
  }

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>
      <Header lang={lang} setLang={setLang} />

      {/* Toolbar */}
      <div id="map-view" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <div id="map-toolbar">
          <button className="back-btn" onClick={() => router.push("/")}>
            ← <span>{t.back}</span>
          </button>
          <div id="search-wrap">
            <input
              id="search-bar"
              type="text"
              placeholder={t.searchPH}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="locate-btn" onClick={handleLocate} disabled={locating}>
            {locating ? "…" : "📍"} <span>{t.locate}</span>
          </button>
          <button className="add-map-btn" onClick={() => setShowModal(true)}>
            ＋ <span>{t.addMap}</span>
          </button>
        </div>

        {/* Map — sticky top half */}
        <div style={{ height: "45vh", flexShrink: 0, position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute", inset: 0, zIndex: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(8,9,15,0.7)", gap: 10, color: "var(--text2)", fontSize: "0.85rem",
              }}
            >
              <div className="loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
              {t.loadingTxt}
            </div>
          )}
          <MapView
            cobblers={filtered}
            userLocation={location}
            onReady={handleMapReady}
          />
        </div>

        {/* Scrollable card list */}
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          <CobblerList
            cobblers={filtered}
            userLocation={location}
            t={t}
            lang={lang}
          />

          {/* Footer inside scroll area */}
          <footer style={{ marginTop: 8 }}>
            <div className="footer-main">
              <div className="footer-section">
                <div className="footer-title">{t.footerContribute}</div>
                <div className="footer-content">{t.footerContributeDesc}</div>
              </div>
              <div className="footer-divider" />
              <div className="footer-section">
                <div className="footer-title">{t.footerBilingual}</div>
                <div className="footer-content">{t.footerBilingualDesc}</div>
              </div>
            </div>
            <div className="footer-divider" />
            <div className="footer-developer">
              Developed by{" "}
              <a href="https://shakib-mahamud.vercel.app/" target="_blank" rel="noopener noreferrer">
                Shakib Mahamud
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Add Cobbler Modal */}
      {showModal && (
        <AddModal
          lang={lang}
          gpsLat={location?.lat}
          gpsLng={location?.lng}
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(24px, 5vh, 40px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--card2)",
            border: "1px solid var(--border2)",
            color: "var(--text)",
            padding: "11px 22px",
            borderRadius: 50,
            fontSize: "0.82rem",
            fontWeight: 500,
            zIndex: 99999,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            maxWidth: "90vw",
            textAlign: "center",
            animation: "fadeUp 0.28s ease",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
