"use client";
import { useEffect, useRef } from "react";
import type { Map as LMap, Marker, CircleMarker } from "leaflet";
import { Cobbler } from "@/lib/firestore";
import "leaflet/dist/leaflet.css";

interface Props {
  cobblers: Cobbler[];
  userLoc: { lat: number; lng: number } | null;
  mapRef: React.MutableRefObject<{ flyTo: (lat: number, lng: number, zoom: number) => void } | null>;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function fmtDist(km: number) { return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`; }

export default function LeafletMap({ cobblers, userLoc, mapRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMap   = useRef<LMap | null>(null);
  const markers      = useRef<Marker[]>([]);
  const userMarker   = useRef<CircleMarker | null>(null);

  // ── Init map once ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current || !containerRef.current) return;

    import("leaflet").then((L) => {
      // Fix webpack asset path for default icons (not used but avoids console errors)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, { zoomControl: true, attributionControl: true })
        .setView([23.7806, 90.4193], 12);

      // CartoDB Voyager — warm, light, matches the UI
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://www.openstreetmap.org/">OSM</a> © <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      leafletMap.current = map;

      // Expose flyTo to parent via mapRef
      if (mapRef) {
        mapRef.current = {
          flyTo: (lat, lng, zoom) => map.flyTo([lat, lng], zoom, { duration: 1.2 }),
        };
      }

      // Initial render of markers
      renderMarkers(L, map, cobblers, userLoc);
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-render markers when cobblers / userLoc changes ─────────────────────
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    import("leaflet").then((L) => renderMarkers(L, map, cobblers, userLoc));
  }, [cobblers, userLoc]);

  // ── User location marker ───────────────────────────────────────────────────
  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !userLoc) return;
    import("leaflet").then((L) => {
      if (userMarker.current) map.removeLayer(userMarker.current);
      userMarker.current = L.circleMarker([userLoc.lat, userLoc.lng], {
        radius: 9, fillColor: "#4A9EFF", fillOpacity: 0.9, color: "#fff", weight: 2.5,
      }).addTo(map).bindPopup("<b style='font-family:Manrope,sans-serif'>You are here</b>");
      map.flyTo([userLoc.lat, userLoc.lng], 15, { duration: 1 });
    });
  }, [userLoc]);

  function renderMarkers(
    L: typeof import("leaflet"),
    map: LMap,
    list: Cobbler[],
    loc: { lat: number; lng: number } | null
  ) {
    // Clear old markers
    markers.current.forEach((m) => map.removeLayer(m));
    markers.current = [];

    list.forEach((c) => {
      if (!c.lat || !c.lng) return;

      const pinSvg = (highlight: boolean) => `
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
            fill="${highlight ? "#8B6F47" : "#4A3428"}"
            style="filter:drop-shadow(${highlight ? "0 0 8px rgba(139,111,71,0.7)" : "0 3px 8px rgba(74,52,40,0.5)"})"/>
          <circle cx="14" cy="14" r="5" fill="rgba(245,235,221,0.35)"/>
          <text x="14" y="18" text-anchor="middle" font-size="10" fill="#FAF8F5">👟</text>
        </svg>`;

      const icon = (hi: boolean) => L.divIcon({
        className: "", html: pinSvg(hi),
        iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -38],
      });

      const distStr = loc
        ? `<span style="color:#66785F;font-size:11px;font-weight:600">${fmtDist(haversineKm(loc.lat, loc.lng, c.lat, c.lng))} away</span>`
        : "";

      const photos = (c.photos || [])
        .map((u) => `<img src="${u}" loading="lazy" style="width:84px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #E8DDD0"/>`)
        .join("");

      const tags = (c.services || [])
        .map((s) => `<span style="background:#F5EBDD;color:#4A3428;border:1px solid #E0D0BC;border-radius:50px;padding:2px 9px;font-size:10px;font-weight:600">${s}</span>`)
        .join("");

      const popup = `
        <div style="padding:14px 16px 12px;font-family:Manrope,sans-serif">
          ${photos ? `<div style="display:flex;gap:6px;margin-bottom:10px;overflow-x:auto">${photos}</div>` : ""}
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
            <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:#1F1F1F;line-height:1.2">${c.name}</div>
            ${c.isNew ? `<span style="background:#E8F5E3;color:#4A7C3F;border:1px solid #B8D4AE;border-radius:50px;padding:2px 8px;font-size:10px;font-weight:700;white-space:nowrap">✦ NEW</span>` : ""}
          </div>
          <div style="height:1px;background:#F0E8DC;margin:6px 0"></div>
          <div style="font-size:12px;color:#6B5B4A;margin-bottom:4px">📍 ${c.area}</div>
          <div style="font-size:12px;margin-bottom:4px"><a href="tel:${c.phone}" style="color:#4A3428;font-weight:700;text-decoration:none">📞 ${c.phone}</a></div>
          ${c.workHours ? `<div style="font-size:12px;color:#8B7355;margin-bottom:4px">🕐 ${c.workHours}${c.workDays ? " · " + c.workDays : ""}</div>` : ""}
          ${distStr ? `<div style="margin-bottom:6px">${distStr}</div>` : ""}
          ${tags ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${tags}</div>` : ""}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}&travelmode=walking"
            target="_blank" rel="noopener"
            style="display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;background:#4A3428;color:#FAF8F5;border-radius:50px;font-weight:700;font-size:12px;text-decoration:none;margin-top:2px">
            🗺 Get Directions
          </a>
        </div>`;

      const marker = L.marker([c.lat, c.lng], { icon: icon(false) })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 280 });

      marker.on("mouseover", () => { marker.setIcon(icon(true)); marker.openPopup(); });
      marker.on("mouseout",  () => { marker.setIcon(icon(false)); });
      markers.current.push(marker);
    });
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );
}
