"use client";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker, CircleMarker } from "leaflet";
import { Cobbler, UserLocation } from "@/lib/types";
import { haversineDistance } from "@/lib/utils";

interface MapViewProps {
  cobblers: Cobbler[];
  userLocation: UserLocation | null;
  onReady?: (map: LeafletMap) => void;
}

export function MapView({ cobblers, userLocation, onReady }: MapViewProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<CircleMarker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Init map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, { zoomControl: true }).setView([23.7806, 90.4193], 12);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://www.openstreetmap.org/">OSM</a> © <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;
      onReady?.(map);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Render markers when cobblers change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    import("leaflet").then((L) => {
      // Clear old markers
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      cobblers.forEach((c) => {
        if (!c.lat || !c.lng) return;

        const pinIcon = (hi: boolean) =>
          L.divIcon({
            className: "",
            html: `<svg width="26" height="34" viewBox="0 0 26 34" fill="none">
              <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21S26 22.75 26 13C26 5.82 20.18 0 13 0z"
                fill="${hi ? "#f0b84a" : "#d4952a"}"
                style="filter:drop-shadow(${hi ? "0 0 14px rgba(240,184,74,.75)" : "0 3px 10px rgba(0,0,0,.55)"})"/>
              <circle cx="13" cy="13" r="4.5" fill="rgba(0,0,0,.3)"/>
            </svg>`,
            iconSize: [26, 34],
            iconAnchor: [13, 34],
            popupAnchor: [0, -36],
          });

        const tags = (c.services || []).map((s) => `<span class="popup-tag">${s}</span>`).join("");
        const photos = (c.photos || []).map((u) => `<img src="${u}" loading="lazy"/>`).join("");
        const newBadge = c.isNew ? `<div class="popup-new-badge">✦ NEW</div>` : "";
        const hours = c.workHours
          ? `<div class="popup-row"><span>🕐</span><span>${c.workHours}${c.workDays ? " · " + c.workDays : ""}</span></div>`
          : "";
        const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}&travelmode=walking`;

        const distStr = userLocation
          ? ` · ${haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng).toFixed(1)}km away`
          : "";

        const popupHtml = `<div class="popup-inner">
          ${newBadge}
          ${photos ? `<div class="popup-photos">${photos}</div>` : ""}
          <div class="popup-header">
            <div>
              <div class="popup-name">${c.name}</div>
              <div style="font-size:.72rem;color:var(--text3);margin-top:2px">${distStr}</div>
            </div>
            <div class="popup-rating">
              <span class="star">★</span>
              <span class="score">${c.rating ?? "New"}</span>
            </div>
          </div>
          <div class="popup-divider"></div>
          <div class="popup-row"><span>📍</span><span>${c.area}</span></div>
          <div class="popup-row"><span>📞</span><a href="tel:${c.phone}">${c.phone}</a></div>
          ${hours}
          ${tags ? `<div class="popup-tags">${tags}</div>` : ""}
          <a href="${dirUrl}" target="_blank" class="dir-btn">🗺️ Get Directions</a>
        </div>`;

        const marker = L.marker([c.lat, c.lng], { icon: pinIcon(false) })
          .addTo(map)
          .bindPopup(popupHtml, { maxWidth: 310 });

        marker.on("mouseover", () => { marker.setIcon(pinIcon(true)); marker.openPopup(); });
        marker.on("mouseout", () => { marker.setIcon(pinIcon(false)); });

        markersRef.current.push(marker);
      });
    });
  }, [cobblers, userLocation]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    import("leaflet").then((L) => {
      if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 9,
        fillColor: "#60a5fa",
        fillOpacity: 0.9,
        color: "#fff",
        weight: 2.5,
      })
        .addTo(map)
        .bindPopup("<b>You are here</b>")
        .openPopup();
      map.setView([userLocation.lat, userLocation.lng], 15);
    });
  }, [userLocation]);

  return <div ref={containerRef} id="map" style={{ flex: 1, minHeight: 0 }} />;
}
