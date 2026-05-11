"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchCobblers, addCobbler, Cobbler } from "@/lib/firestore";
import { uploadPhotos, compressImage } from "@/lib/cloudinary";

// ─── TRANSLATIONS (original, unchanged) ────────────────────────────────────────
const translations = {
  en: {
    appName: "Muchi Koi",
    tagline: "Find a cobbler anytime",
    liveBadge: "Live · Dhaka",
    heroHeadline1: "Find a",
    heroHeadline2: "Cobbler",
    heroHeadline3: "anytime",
    heroSub: "Find the nearest cobbler in Dhaka — instantly, for free.",
    findBtn: "📍 Find Cobblers Near Me",
    addBtn: "+ Add a Cobbler",
    stat1: "{{count}} Cobblers",
    stat2: "∞ Always Free",
    stat3: "🇧🇩 Dhaka City",
    footerText: "This is a community-driven project. Help grow the list of cobblers and add cobblers in your area.",
    footerCredit: "Developed by Shakib Mahamud",
    findTitle: "Find Cobblers",
    searchPlaceholder: "Search by name, area, or service…",
    locateMe: "Locate Me",
    addCobbler: "+ Add",
    back: "← Back",
    callBtn: "📞 Call",
    directionsBtn: "🗺 Directions",
    open: "Open",
    closed: "Closed",
    awayLabel: "away",
    noResults: "No cobblers found nearby. Be the first to add one!",
    addTitle: "Add a Cobbler",
    addSubtitle: "Help your community. Takes 2 minutes.",
    cobblerName: "Cobbler Name",
    phoneNumber: "Phone Number",
    locationDesc: "Location Description",
    services: "Services",
    workHours: "Work Hours",
    workDays: "Work Days",
    uploadLabel: "Add 1–2 pictures of the cobbler / stall",
    uploadHint: "Drag & drop or tap to upload",
    cancelBtn: "Cancel",
    submitBtn: "Submit Cobbler",
    submitting: "Uploading photos…",
    saving: "Saving…",
    successMsg: "Cobbler added! Visible to everyone now.",
    filterAll: "All",
    namePlaceholder: "e.g. Rahim Muchi",
    phonePlaceholder: "e.g. 01712345678",
    locationPlaceholder: "e.g. Near Mirpur 10 Metro Station, Gate 2",
    hoursPlaceholder: "e.g. 9:00 AM – 8:00 PM",
    daysPlaceholder: "e.g. Sat–Thu",
    servicesPH: "Sole Repair, Polish, Stitching…",
    loading: "Loading cobblers…",
    locating: "Getting your location…",
    locFail: "Location unavailable.",
    toastPhotoErr: "Max 2 photos allowed.",
    toastSizeErr: "Each photo must be under 10MB.",
    toastErr: "Please fill Name, Phone, and Location.",
    resultCount: "found",
    sortedByDist: "· sorted by distance",
  },
  bn: {
    appName: "মুচি কই",
    tagline: "যেকোনো সময় মুচি খুঁজুন",
    liveBadge: "লাইভ · ঢাকা",
    heroHeadline1: "একজন",
    heroHeadline2: "মুচি",
    heroHeadline3: "খুঁজুন এখনই",
    heroSub: "ঢাকার সবচেয়ে কাছের মুচি খুঁজুন — তাৎক্ষণিকভাবে, বিনামূল্যে।",
    findBtn: "📍 কাছের মুচি খুঁজুন",
    addBtn: "+ মুচি যোগ করুন",
    stat1: "{{count}} জন মুচি",
    stat2: "∞ সম্পূর্ণ বিনামূল্যে",
    stat3: "🇧🇩 ঢাকা শহর",
    footerText: "এটি একটি কমিউনিটি প্রজেক্ট। আপনার এলাকার মুচি যোগ করে তালিকা বাড়াতে সাহায্য করুন।",
    footerCredit: "তৈরি করেছেন শাকিব মাহমুদ",
    findTitle: "মুচি খুঁজুন",
    searchPlaceholder: "নাম, এলাকা বা সেবা দিয়ে খুঁজুন…",
    locateMe: "আমার অবস্থান",
    addCobbler: "+ যোগ করুন",
    back: "← ফিরে যান",
    callBtn: "📞 কল করুন",
    directionsBtn: "🗺 পথনির্দেশ",
    open: "খোলা",
    closed: "বন্ধ",
    awayLabel: "দূরে",
    noResults: "কাছে কোনো মুচি পাওয়া যায়নি। প্রথম একজন যোগ করুন!",
    addTitle: "মুচি যোগ করুন",
    addSubtitle: "কমিউনিটিকে সাহায্য করুন। মাত্র ২ মিনিট লাগবে।",
    cobblerName: "মুচির নাম",
    phoneNumber: "ফোন নম্বর",
    locationDesc: "অবস্থান বিবরণ",
    services: "সেবাসমূহ",
    workHours: "কাজের সময়",
    workDays: "কাজের দিন",
    uploadLabel: "মুচির স্টল সহ ১–২টি ছবি যোগ করুন",
    uploadHint: "ড্র্যাগ করুন বা ট্যাপ করুন",
    cancelBtn: "বাতিল",
    submitBtn: "জমা দিন",
    submitting: "ছবি আপলোড হচ্ছে…",
    saving: "সংরক্ষণ হচ্ছে…",
    successMsg: "✓ মুচি যোগ হয়েছে! সবাই এখন দেখতে পাচ্ছে।",
    filterAll: "সব",
    namePlaceholder: "যেমন: রহিম মুচি",
    phonePlaceholder: "যেমন: ০১৭১২৩৪৫৬৭৮",
    locationPlaceholder: "যেমন: মিরপুর ১০ মেট্রো স্টেশনের কাছে, গেট ২",
    hoursPlaceholder: "যেমন: সকাল ৯টা – রাত ৮টা",
    daysPlaceholder: "যেমন: শনি–বৃহস্পতি",
    servicesPH: "সোল মেরামত, পলিশ, সেলাই…",
    loading: "মুচির তালিকা লোড হচ্ছে…",
    locating: "অবস্থান নির্ণয় হচ্ছে…",
    locFail: "অবস্থান পাওয়া যায়নি।",
    toastPhotoErr: "সর্বোচ্চ ২টি ছবি দেওয়া যাবে।",
    toastSizeErr: "প্রতিটি ছবি ১০MB-এর কম হতে হবে।",
    toastErr: "নাম, ফোন ও এলাকা পূরণ করুন।",
    resultCount: "পাওয়া গেছে",
    sortedByDist: "· দূরত্ব অনুযায়ী",
  },
};

// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
const SERVICE_COLORS: Record<string, string> = {
  "Shoe Repair":      "#66785F",
  "Leather Polish":   "#8B6F47",
  "Bag Repair":       "#7B6E8A",
  "Sandal Stitching": "#B8860B",
  "Zipper Fix":       "#5B7FA6",
};
const ALL_SERVICES = Object.keys(SERVICE_COLORS);

// ─── UTILS ──────────────────────────────────────────────────────────────────────
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

function isOpenNow(workHours?: string | null): boolean {
  if (!workHours) return true;
  const h = new Date().getHours();
  const m = workHours.match(/(\d+)(?::(\d+))?\s*(AM|PM)\s*[–\-]\s*(\d+)(?::(\d+))?\s*(AM|PM)/i);
  if (!m) return true;
  let s = parseInt(m[1]); if (m[3].toUpperCase() === "PM" && s !== 12) s += 12;
  let e = parseInt(m[4]); if (m[6].toUpperCase() === "PM" && e !== 12) e += 12;
  return h >= s && h < e;
}

// ─── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!msg) return;
    setVis(true);
    const t = setTimeout(() => { setVis(false); setTimeout(onDone, 300); }, 3000);
    return () => clearTimeout(t);
  }, [msg]);
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: "clamp(24px,5vh,40px)", left: "50%",
      transform: `translateX(-50%) translateY(${vis ? 0 : "12px"})`,
      background: "#1F1F1F", color: "#FAF8F5",
      padding: "11px 22px", borderRadius: 50,
      fontSize: "0.82rem", fontWeight: 600, zIndex: 99999,
      opacity: vis ? 1 : 0, pointerEvents: "none",
      transition: "opacity 0.28s, transform 0.28s",
      whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      maxWidth: "90vw", textAlign: "center",
      fontFamily: "Manrope, sans-serif",
    }}>
      {msg}
    </div>
  );
}

// ─── COBBLER AVATAR ─────────────────────────────────────────────────────────────
function CobblerAvatar({ name, size = 64 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) * 7 + name.charCodeAt(name.length - 1) * 13) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue},35%,55%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontFamily: "Cormorant Garamond, serif",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
      border: "3px solid #F5EBDD",
    }}>
      {initials}
    </div>
  );
}

// ─── SERVICE TAG ────────────────────────────────────────────────────────────────
function ServiceTag({ service }: { service: string }) {
  const color = SERVICE_COLORS[service] || "#66785F";
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}40`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11,
      fontWeight: 600, whiteSpace: "nowrap", fontFamily: "Manrope, sans-serif",
    }}>
      {service}
    </span>
  );
}

// ─── COBBLER CARD ────────────────────────────────────────────────────────────────
function CobblerCard({
  cobbler: c, userLoc, t, index,
}: {
  cobbler: Cobbler;
  userLoc: { lat: number; lng: number } | null;
  t: typeof translations["en"];
  index: number;
}) {
  const open = isOpenNow(c.workHours);
  const dist = userLoc ? haversineDistance(userLoc.lat, userLoc.lng, c.lat, c.lng) : null;

  return (
    <div
      className="card-animate"
      style={{
        background: "#FFFFFF", borderRadius: 18, padding: 16,
        boxShadow: "0 2px 12px rgba(74,52,40,0.08)",
        border: "1px solid #F0E8DC", animationDelay: `${index * 60}ms`,
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {c.photos?.[0] ? (
          <img src={c.photos[0]} alt={c.name} style={{
            width: 64, height: 64, borderRadius: 14, objectFit: "cover",
            flexShrink: 0, border: "2px solid #F5EBDD",
          }} />
        ) : (
          <CobblerAvatar name={c.name} size={64} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: "#1F1F1F" }}>
                {c.name}
              </div>
              <div style={{ fontSize: 12, color: "#8B7355", marginTop: 2, fontFamily: "Manrope, sans-serif" }}>
                📍 {c.area}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{
                background: open ? "#E8F5E3" : "#FEE8E8",
                color: open ? "#4A7C3F" : "#C0392B",
                borderRadius: 20, padding: "2px 9px",
                fontSize: 11, fontWeight: 700, fontFamily: "Manrope, sans-serif",
              }}>
                {open ? t.open : t.closed}
              </span>
              {dist !== null && (
                <span style={{ fontSize: 12, color: "#66785F", fontWeight: 600, fontFamily: "Manrope, sans-serif" }}>
                  {formatDistance(dist)} {t.awayLabel}
                </span>
              )}
            </div>
          </div>
          {(c.workHours || c.workDays) && (
            <div style={{ fontSize: 12, color: "#9B8B7A", marginTop: 4, fontFamily: "Manrope, sans-serif" }}>
              🕐 {c.workHours}{c.workDays ? ` · ${c.workDays}` : ""}
            </div>
          )}
        </div>
      </div>

      {c.services.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {c.services.map((s) => <ServiceTag key={s} service={s} />)}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <a href={`tel:${c.phone}`} style={{
          flex: 1, background: "#4A3428", color: "#FAF8F5",
          border: "none", borderRadius: 12, padding: "10px 0",
          fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13,
          cursor: "pointer", textAlign: "center", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {t.callBtn}
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}&travelmode=walking`}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, background: "#F5EBDD", color: "#4A3428",
            border: "1px solid #E0D0BC", borderRadius: 12, padding: "10px 0",
            fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13,
            cursor: "pointer", textAlign: "center", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          {t.directionsBtn}
        </a>
      </div>
    </div>
  );
}

// ─── LEAFLET MAP (dynamically loaded, no SSR) ────────────────────────────────────
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

// ─── ADD COBBLER MODAL ───────────────────────────────────────────────────────────
function AddCobblerModal({
  t, lang, gpsLat, gpsLng, onClose, onAdded, showToast,
}: {
  t: typeof translations["en"];
  lang: string;
  gpsLat: number | null;
  gpsLng: number | null;
  onClose: () => void;
  onAdded: (c: Cobbler) => void;
  showToast: (msg: string) => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", area: "", services: "", workHours: "", workDays: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [btnText, setBtnText] = useState(t.submitBtn);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inp = (name: string) => ({
    name,
    value: form[name as keyof typeof form],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
    style: {
      width: "100%", border: "1.5px solid #E0D0BC", borderRadius: 12,
      padding: "11px 14px", fontFamily: "Manrope, sans-serif",
      fontSize: 14, color: "#1F1F1F", background: "#FAF8F5",
      outline: "none", boxSizing: "border-box" as const,
    },
  });

  function handleFiles(incoming: File[]) {
    if (files.length + incoming.length > 2) { showToast(t.toastPhotoErr); return; }
    for (const f of incoming) {
      if (f.size > 10 * 1024 * 1024) { showToast(t.toastSizeErr); return; }
    }
    const merged = [...files, ...incoming].slice(0, 2);
    setFiles(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  }

  function removeFile(i: number) {
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.area.trim()) {
      showToast(t.toastErr); return;
    }
    setLoading(true);
    try {
      let photos: string[] = [];
      if (files.length > 0) {
        setShowProgress(true);
        setBtnText(t.submitting);
        photos = await uploadPhotos(files, setProgress);
        setShowProgress(false);
      }
      setBtnText(t.saving);
      const lat = gpsLat ?? 23.7806 + (Math.random() - 0.5) * 0.05;
      const lng = gpsLng ?? 90.4193 + (Math.random() - 0.5) * 0.05;
      const services = form.services.split(",").map((s) => s.trim()).filter(Boolean);
      const id = await addCobbler({
        name: form.name, phone: form.phone, area: form.area,
        services, workHours: form.workHours || null,
        workDays: form.workDays || null, photos, lat, lng,
      });
      const newC: Cobbler = {
        id, name: form.name, phone: form.phone, area: form.area,
        services, workHours: form.workHours || null,
        workDays: form.workDays || null, photos, lat, lng,
        rating: null, isNew: true, verified: true, createdAt: new Date(),
      };
      onAdded(newC);
      setSuccess(true);
      showToast(t.successMsg);
      setTimeout(onClose, 1800);
    } catch (err: unknown) {
      showToast(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(false);
      setShowProgress(false);
      setProgress(0);
      setBtnText(t.submitBtn);
    }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "Manrope, sans-serif", fontSize: 13,
    fontWeight: 600, color: "#4A3428", display: "block", marginBottom: 6,
  };

  return (
    <div
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose(); }}
      data-overlay="1"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(30,20,15,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{
        background: "#FAF8F5", borderRadius: "24px 24px 0 0",
        padding: "24px 20px 36px", width: "100%", maxWidth: 520,
        maxHeight: "92dvh", overflowY: "auto",
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 700, color: "#1F1F1F" }}>
              {t.addTitle}
            </div>
            <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#8B7355", marginTop: 2 }}>
              {t.addSubtitle}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#F0E8DC", border: "none", borderRadius: 10,
            width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#4A3428",
          }}>×</button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 16, color: "#4A3428" }}>
              {t.successMsg}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* GPS strip */}
            {gpsLat && gpsLng && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(102,120,95,0.1)", border: "1px solid rgba(102,120,95,0.25)",
                borderRadius: 8, padding: "10px 14px", fontSize: "0.8rem",
                color: "#66785F", fontFamily: "Manrope, sans-serif",
              }}>
                <span>📍</span>
                <span>{lang === "bn" ? "অবস্থান পাওয়া গেছে!" : "Location captured!"}</span>
              </div>
            )}

            <div><label style={labelStyle}>{t.cobblerName} *</label><input {...inp("name")} placeholder={t.namePlaceholder} /></div>
            <div><label style={labelStyle}>{t.phoneNumber} *</label><input {...inp("phone")} type="tel" placeholder={t.phonePlaceholder} /></div>
            <div><label style={labelStyle}>{t.locationDesc} *</label><input {...inp("area")} placeholder={t.locationPlaceholder} /></div>
            <div><label style={labelStyle}>{t.services}</label><input {...inp("services")} placeholder={t.servicesPH} /></div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={labelStyle}>{t.workHours}</label><input {...inp("workHours")} placeholder={t.hoursPlaceholder} /></div>
              <div><label style={labelStyle}>{t.workDays}</label><input {...inp("workDays")} placeholder={t.daysPlaceholder} /></div>
            </div>

            {/* Photo upload */}
            <div>
              <label style={labelStyle}>{t.uploadLabel}</label>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: "2px dashed #C8B89A", borderRadius: 14,
                  padding: previews.length ? 0 : "24px 16px",
                  textAlign: "center", cursor: "pointer",
                  background: "#F5EBDD", overflow: "hidden", minHeight: previews.length ? 120 : undefined,
                }}
              >
                {previews.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, padding: 10, flexWrap: "wrap" }}>
                    {previews.map((src, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={src} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E0D0BC" }} />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          style={{
                            position: "absolute", top: -6, right: -6, background: "#e74c3c",
                            color: "#fff", border: "none", borderRadius: "50%",
                            width: 18, height: 18, fontSize: 10, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#8B7355" }}>{t.uploadHint}</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                onChange={(e) => { handleFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />

              {showProgress && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5EBDD", border: "1px solid #E0D0BC", borderRadius: 8, padding: "10px 14px", marginTop: 8 }}>
                  <div style={{ flex: 1, background: "#E0D0BC", borderRadius: 50, height: 4 }}>
                    <div style={{ width: `${progress}%`, height: 4, background: "#4A3428", borderRadius: 50, transition: "width 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#8B7355", fontFamily: "Manrope, sans-serif" }}>{progress}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={onClose} style={{
                flex: 1, background: "#F0E8DC", color: "#4A3428",
                border: "none", borderRadius: 14, padding: "13px 0",
                fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>{t.cancelBtn}</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, background: loading ? "#9B8B7A" : "#4A3428", color: "#FAF8F5",
                border: "none", borderRadius: 14, padding: "13px 0",
                fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {btnText}
                {loading && <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FIND PAGE ───────────────────────────────────────────────────────────────────
function FindPage({
  t, lang, onBack, cobblers, onAddCobbler,
}: {
  t: typeof translations["en"];
  lang: string;
  onBack: () => void;
  cobblers: Cobbler[];
  onAddCobbler: (c: Cobbler) => void;
}) {
  const [search, setSearch] = useState("");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);
  const mapRef = useRef<{ flyTo: (lat: number, lng: number, zoom: number) => void } | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  async function handleLocate() {
    if (!navigator.geolocation) { showToast(t.locFail); return; }
    setLocating(true);
    showToast(t.locating);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc); setGpsLat(loc.lat); setGpsLng(loc.lng);
        setLocating(false);
        // Fly to nearest cobbler
        const sorted = [...filtered].sort((a, b) =>
          haversineDistance(loc.lat, loc.lng, a.lat, a.lng) -
          haversineDistance(loc.lat, loc.lng, b.lat, b.lng)
        );
        if (sorted[0]) setTimeout(() => mapRef.current?.flyTo(sorted[0].lat, sorted[0].lng, 16), 400);
      },
      () => { showToast(t.locFail); setLocating(false); },
      { timeout: 8000 }
    );
  }

  const filtered = cobblers
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.services.some((s) => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (!userLoc) return 0;
      return (
        haversineDistance(userLoc.lat, userLoc.lng, a.lat, a.lng) -
        haversineDistance(userLoc.lat, userLoc.lng, b.lat, b.lng)
      );
    });

  return (
    <div style={{ minHeight: "100dvh", background: "#FAF8F5", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        background: "#FFFFFF", borderBottom: "1px solid #F0E8DC",
        padding: "10px 12px", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 8px rgba(74,52,40,0.06)",
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", maxWidth: 520, margin: "0 auto" }}>
          <button onClick={onBack} style={{
            background: "#F5EBDD", border: "none", borderRadius: 10,
            padding: "8px 12px", cursor: "pointer",
            fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#4A3428", fontWeight: 600,
            whiteSpace: "nowrap", flexShrink: 0,
          }}>{t.back}</button>

          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>🔍</span>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                width: "100%", border: "1.5px solid #E0D0BC", borderRadius: 10,
                padding: "9px 12px 9px 32px", fontFamily: "Manrope, sans-serif",
                fontSize: 13, color: "#1F1F1F", background: "#FAF8F5", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button onClick={handleLocate} disabled={locating} style={{
            background: "#66785F", color: "#fff", border: "none", borderRadius: 10,
            padding: "9px 12px", cursor: "pointer", fontFamily: "Manrope, sans-serif",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
            opacity: locating ? 0.6 : 1,
          }}>{locating ? "…" : "📍"}</button>

          <button onClick={() => setShowAdd(true)} style={{
            background: "#4A3428", color: "#FAF8F5", border: "none", borderRadius: 10,
            padding: "9px 12px", cursor: "pointer", fontFamily: "Manrope, sans-serif",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0,
          }}>{t.addCobbler}</button>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", width: "100%", padding: "12px 12px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Real Leaflet Map */}
        <div style={{ borderRadius: 16, overflow: "hidden", border: "2px solid #E8DDD0", height: 300, flexShrink: 0 }}>
          <LeafletMap cobblers={filtered} userLoc={userLoc} mapRef={mapRef} />
        </div>

        {/* Results count */}
        <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#8B7355" }}>
          {filtered.length} {t.resultCount}
          {userLoc && ` ${t.sortedByDist}`}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", fontFamily: "Manrope, sans-serif", color: "#9B8B7A" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👟</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.noResults}</div>
            <button onClick={() => setShowAdd(true)} style={{
              marginTop: 16, background: "#4A3428", color: "#FAF8F5",
              border: "none", borderRadius: 12, padding: "11px 24px",
              fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>{t.addBtn}</button>
          </div>
        ) : (
          filtered.map((c, i) => <CobblerCard key={c.id} cobbler={c} userLoc={userLoc} t={t} index={i} />)
        )}
      </div>

      {showAdd && (
        <AddCobblerModal
          t={t} lang={lang} gpsLat={gpsLat} gpsLng={gpsLng}
          onClose={() => setShowAdd(false)}
          onAdded={(c) => { onAddCobbler(c); setShowAdd(false); }}
          showToast={showToast}
        />
      )}
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────────
function LandingPage({
  t, lang, setLang, cobblers, onFind, onAdd,
}: {
  t: typeof translations["en"];
  lang: string;
  setLang: (l: "en" | "bn") => void;
  cobblers: Cobbler[];
  onFind: () => void;
  onAdd: () => void;
}) {
  return (
    <div style={{ minHeight: "100dvh", background: "#FAF8F5", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .hero-animate   { animation: fadeIn 0.7s ease both; }
        .hero-animate-2 { animation: fadeIn 0.7s 0.12s ease both; }
        .hero-animate-3 { animation: fadeIn 0.7s 0.24s ease both; }
        .hero-animate-4 { animation: fadeIn 0.7s 0.36s ease both; }
        .hero-animate-5 { animation: fadeIn 0.7s 0.48s ease both; }
        .card-animate   { animation: fadeIn 0.4s ease both; }
        .btn-primary:hover  { background: #3A2418 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(74,52,40,0.3) !important; }
        .btn-secondary:hover{ background: #EDD9C0 !important; transform: translateY(-1px); }
        .btn-primary, .btn-secondary { transition: all 0.2s ease !important; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #F0E8DC", background: "#FFFFFF",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#4A3428", letterSpacing: "-0.3px" }}>
            {t.appName}
          </div>
          <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 11, color: "#8B7355" }}>
            {t.tagline}
          </div>
        </div>
        <div style={{ display: "flex", background: "#F0E8DC", borderRadius: 10, overflow: "hidden", border: "1px solid #E0D0BC" }}>
          {(["en", "bn"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? "#4A3428" : "transparent",
              color: lang === l ? "#FAF8F5" : "#8B7355",
              border: "none", padding: "6px 12px",
              fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12,
              cursor: "pointer", transition: "all 0.15s",
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          {/* Live badge */}
          <div className="hero-animate" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#E8F5E3", border: "1px solid #B8D4AE",
            borderRadius: 20, padding: "5px 14px", marginBottom: 28,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A7C3F", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700, color: "#3A6B35" }}>
              {t.liveBadge}
            </span>
          </div>

          {/* Headline */}
          <div className="hero-animate-2" style={{ marginBottom: 16 }}>
            <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(34px,9vw,52px)", fontWeight: 800, color: "#1F1F1F", lineHeight: 1.15, letterSpacing: "-1px" }}>
              {t.heroHeadline1}{" "}
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: "#4A3428", fontStyle: "italic" }}>
                {t.heroHeadline2}
              </span>
              <br />{t.heroHeadline3}
            </h1>
          </div>

          {/* Sub */}
          <p className="hero-animate-3" style={{ fontFamily: "Manrope, sans-serif", fontSize: 16, color: "#6B5B4A", lineHeight: 1.6, marginBottom: 32, maxWidth: 380 }}>
            {t.heroSub}
          </p>

          {/* CTAs */}
          <div className="hero-animate-4" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            <button className="btn-primary" onClick={onFind} style={{
              background: "#4A3428", color: "#FAF8F5", border: "none", borderRadius: 14,
              padding: "16px 24px", fontFamily: "Manrope, sans-serif", fontWeight: 800,
              fontSize: 16, cursor: "pointer", boxShadow: "0 4px 16px rgba(74,52,40,0.2)", textAlign: "center",
            }}>{t.findBtn}</button>
            <button className="btn-secondary" onClick={onAdd} style={{
              background: "#F5EBDD", color: "#4A3428", border: "1.5px solid #D4C4A8",
              borderRadius: 14, padding: "14px 24px", fontFamily: "Manrope, sans-serif",
              fontWeight: 700, fontSize: 15, cursor: "pointer", textAlign: "center",
            }}>{t.addBtn}</button>
          </div>

          {/* Trust chips */}
          <div className="hero-animate-5" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              t.stat1.replace("{{count}}", String(cobblers.length)),
              t.stat2,
              t.stat3,
            ].map((s) => (
              <div key={s} style={{
                background: "#FFFFFF", border: "1px solid #E0D0BC", borderRadius: 10,
                padding: "7px 13px", fontFamily: "Manrope, sans-serif",
                fontSize: 13, fontWeight: 600, color: "#6B5B4A",
              }}>{s}</div>
            ))}
          </div>

          {/* Services icon strip */}
          <div style={{ marginTop: 40, background: "#FFFFFF", border: "1px solid #F0E8DC", borderRadius: 20, padding: "20px", display: "flex" }}>
            {[{ emoji: "👟", label: "Shoe Repair" }, { emoji: "👜", label: "Bag Repair" }, { emoji: "🧵", label: "Stitching" }, { emoji: "✨", label: "Polish" }].map((item, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRight: i < 3 ? "1px solid #F0E8DC" : "none" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.emoji}</div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 10, color: "#8B7355", fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "#4A3428", color: "#F5EBDD", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, lineHeight: 1.6, opacity: 0.85, maxWidth: 400, margin: "0 auto 10px" }}>
          {t.footerText}
        </p>
        <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, opacity: 0.6 }}>
          {lang === "bn" ? "তৈরি করেছেন " : "Developed by "}
          <a href="https://shakib-mahamud.vercel.app/" target="_blank" rel="noopener noreferrer"
            style={{ color: "#F5EBDD", textDecoration: "underline", fontWeight: 700 }}>
            Shakib Mahamud
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────────
export default function MuchiKoi() {
  const [lang, setLangState] = useState<"en" | "bn">("bn");
  const [page, setPage] = useState<"landing" | "find">("landing");
  const [showAdd, setShowAdd] = useState(false);
  const [cobblers, setCobblers] = useState<Cobbler[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState("");
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLng, setGpsLng] = useState<number | null>(null);

  const t = translations[lang];

  // Load lang preference
  useEffect(() => {
    const saved = localStorage.getItem("muchi-lang") as "en" | "bn" | null;
    if (saved) setLangState(saved);
  }, []);

  function setLang(l: "en" | "bn") {
    setLangState(l);
    localStorage.setItem("muchi-lang", l);
  }

  // Load from Firestore on mount
  useEffect(() => {
    fetchCobblers()
      .then((data) => setCobblers(data))
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, []);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  function handleAddCobbler(cobbler: Cobbler) {
    setCobblers((prev) => [cobbler, ...prev]);
  }

  // Silently grab GPS so modal knows it when opened from landing
  function handleFind() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setGpsLat(pos.coords.latitude); setGpsLng(pos.coords.longitude); },
        () => {}
      );
    }
    setPage("find");
  }

  if (page === "find") {
    return (
      <FindPage
        t={t} lang={lang}
        onBack={() => setPage("landing")}
        cobblers={cobblers.filter((c) => c.verified)}
        onAddCobbler={handleAddCobbler}
      />
    );
  }

  return (
    <>
      <LandingPage
        t={t} lang={lang} setLang={setLang}
        cobblers={cobblers}
        onFind={handleFind}
        onAdd={() => setShowAdd(true)}
      />

      {loadingData && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(250,248,245,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, flexDirection: "column", gap: 12,
        }}>
          <div style={{ width: 32, height: 32, border: "3px solid #E0D0BC", borderTopColor: "#4A3428", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#8B7355" }}>{t.loading}</div>
        </div>
      )}

      {showAdd && (
        <AddCobblerModal
          t={t} lang={lang} gpsLat={gpsLat} gpsLng={gpsLng}
          onClose={() => setShowAdd(false)}
          onAdded={(c) => { handleAddCobbler(c); setShowAdd(false); }}
          showToast={showToast}
        />
      )}
      <Toast msg={toast} onDone={() => setToast("")} />
    </>
  );
}
