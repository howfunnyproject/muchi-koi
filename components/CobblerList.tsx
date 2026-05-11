"use client";
import { Cobbler, UserLocation } from "@/lib/types";
import { haversineDistance, formatDistance, isOpenNow } from "@/lib/utils";
import { Translations } from "@/lib/translations";

interface CobblerListProps {
  cobblers: Cobbler[];
  userLocation: UserLocation | null;
  t: Translations;
  lang: string;
}

export function CobblerList({ cobblers, userLocation, t, lang }: CobblerListProps) {
  if (cobblers.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text3)", fontFamily: "var(--font-sans)" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👟</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text2)" }}>{t.noResults}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "12px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 4 }}>
        {cobblers.length} {t.resultCount}
        {userLocation && ` · ${t.sortedByDist}`}
      </div>
      {cobblers.map((c, i) => (
        <CobblerCard key={c.id} cobbler={c} userLocation={userLocation} t={t} lang={lang} index={i} />
      ))}
    </div>
  );
}

interface CardProps {
  cobbler: Cobbler;
  userLocation: UserLocation | null;
  t: Translations;
  lang: string;
  index: number;
}

function CobblerCard({ cobbler: c, userLocation, t, lang, index }: CardProps) {
  const open = isOpenNow(c.workHours);
  const dist = userLocation
    ? haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng)
    : null;
  const isBn = lang === "bn";

  return (
    <div
      className="cobbler-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Photo or avatar */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {c.photos?.[0] ? (
          <img
            src={c.photos[0]}
            alt={c.name}
            style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "1px solid var(--border2)" }}
          />
        ) : (
          <CobblerAvatar name={c.name} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              {c.isNew && (
                <span className="new-badge">{t.newBadge}</span>
              )}
              <div style={{
                fontFamily: isBn ? "Hind Siliguri, sans-serif" : "var(--font-sans)",
                fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginTop: c.isNew ? 4 : 0,
              }}>
                {c.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 2 }}>
                📍 {c.area}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
              <span className={`status-badge ${open ? "open" : "closed"}`}>
                {open ? t.openLabel : t.closedLabel}
              </span>
              {dist !== null && (
                <span style={{ fontSize: "0.72rem", color: "var(--gold-light)", fontWeight: 600 }}>
                  {formatDistance(dist)} {t.awayLabel}
                </span>
              )}
            </div>
          </div>
          {(c.workHours || c.workDays) && (
            <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>
              🕐 {c.workHours}{c.workDays ? ` · ${c.workDays}` : ""}
            </div>
          )}
        </div>
      </div>

      {/* Service tags */}
      {c.services.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {c.services.map((s) => (
            <span key={s} className="popup-tag">{s}</span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <a href={`tel:${c.phone}`} className="card-btn primary">
          {t.callBtn}
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}&travelmode=walking`}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn secondary"
        >
          {t.directionsBtn}
        </a>
      </div>
    </div>
  );
}

function CobblerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) * 7 + name.charCodeAt(name.length - 1) * 13) % 360;
  return (
    <div
      style={{
        width: 64, height: 64, borderRadius: 12,
        background: `hsl(${hue}, 35%, 45%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: "Playfair Display, serif",
        fontSize: 22, fontWeight: 700, flexShrink: 0,
        border: "1px solid var(--border2)",
      }}
    >
      {initials}
    </div>
  );
}
