"use client";
import { useRef, useState } from "react";
import { Lang } from "@/lib/translations";
import T from "@/lib/translations";
import { addCobbler } from "@/lib/firestore";
import { uploadMultiple } from "@/lib/cloudinary";
import { Cobbler, CobblerFormData } from "@/lib/types";

interface AddModalProps {
  lang: Lang;
  gpsLat?: number | null;
  gpsLng?: number | null;
  onClose: () => void;
  onSuccess: (cobbler: Cobbler) => void;
  showToast: (msg: string) => void;
}

const EMPTY_FORM: CobblerFormData = {
  name: "", phone: "", area: "", services: "", workHours: "", workDays: "",
};

export function AddModal({ lang, gpsLat, gpsLng, onClose, onSuccess, showToast }: AddModalProps) {
  const t = T[lang];
  const [form, setForm] = useState<CobblerFormData>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitText, setSubmitText] = useState(t.submit);
  const [locStripVisible, setLocStripVisible] = useState(
    !!(gpsLat && gpsLng)
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFiles(incoming: File[]) {
    if (files.length + incoming.length > 2) {
      showToast(t.toastPhotoErr);
      return;
    }
    for (const f of incoming) {
      if (f.size > 10 * 1024 * 1024) {
        showToast(t.toastSizeErr);
        return;
      }
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
      showToast(t.toastErr);
      return;
    }
    setLoading(true);
    try {
      let photoUrls: string[] = [];
      if (files.length > 0) {
        setShowProgress(true);
        setSubmitText(t.uploading);
        photoUrls = await uploadMultiple(files, (pct) => setProgress(pct));
        setShowProgress(false);
      }
      setSubmitText(t.saving);
      const id = await addCobbler(form, photoUrls, gpsLat, gpsLng);
      const newCobbler: Cobbler = {
        id,
        name: form.name,
        phone: form.phone,
        area: form.area,
        services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        workHours: form.workHours || null,
        workDays: form.workDays || null,
        photos: photoUrls,
        lat: gpsLat ?? 23.7806 + (Math.random() - 0.5) * 0.05,
        lng: gpsLng ?? 90.4193 + (Math.random() - 0.5) * 0.05,
        isNew: true,
        verified: true,
        createdAt: new Date(),
      };
      onSuccess(newCobbler);
      showToast(t.toastOk);
      onClose();
    } catch (err: unknown) {
      showToast(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
      setShowProgress(false);
      setSubmitText(t.submit);
      setProgress(0);
    }
  }

  return (
    <div
      id="modal-overlay"
      className="open"
      onClick={(e) => { if ((e.target as HTMLElement).id === "modal-overlay") onClose(); }}
    >
      <div className="modal">
        <div className={`modal-title${lang === "bn" ? " bn" : ""}`}>{t.mTitle}</div>
        <div className={`modal-sub${lang === "bn" ? " bn" : ""}`}>{t.mSub}</div>

        {locStripVisible && (
          <div id="loc-strip" className="show">
            <span>📍</span>
            <span>{t.locStrip}</span>
          </div>
        )}

        <div className="form-grid">
          {/* Name */}
          <div className="form-group full">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>{t.lName}</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder={t.namePH} />
          </div>
          {/* Phone */}
          <div className="form-group full">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>{t.lPhone}</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder={t.phonePH} />
          </div>
          {/* Area */}
          <div className="form-group full">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>{t.lArea}</label>
            <input name="area" value={form.area} onChange={handleChange} placeholder={t.areaPH} />
          </div>
          {/* Services */}
          <div className="form-group full">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>
              {t.lSvc} <span className="opt-tag">{t.opt}</span>
            </label>
            <input name="services" value={form.services} onChange={handleChange} placeholder={t.servicesPH} />
          </div>
          {/* Hours */}
          <div className="form-group">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>
              {t.lHours} <span className="opt-tag">{t.opt}</span>
            </label>
            <input name="workHours" value={form.workHours} onChange={handleChange} placeholder={t.hoursPH} />
          </div>
          {/* Days */}
          <div className="form-group">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>
              {t.lDays} <span className="opt-tag">{t.opt}</span>
            </label>
            <input name="workDays" value={form.workDays} onChange={handleChange} placeholder={t.daysPH} />
          </div>
          {/* Photos */}
          <div className="form-group full">
            <label className={`form-label${lang === "bn" ? " bn" : ""}`}>
              {t.lPhotos} <span className="opt-tag">{t.photoOpt}</span>
            </label>
            <div
              className="photo-upload-area"
              onClick={() => fileRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => { handleFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }}
              />
              <div className="photo-upload-icon">📷</div>
              <div className="photo-upload-text">{t.uploadTxt}</div>
              <div className="photo-upload-hint">{t.uploadHint}</div>
            </div>
            {previews.length > 0 && (
              <div className="photo-previews">
                {previews.map((src, i) => (
                  <div key={i} className="photo-preview-item">
                    <img src={src} alt="" />
                    <button className="photo-remove" onClick={() => removeFile(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {showProgress && (
              <div className="upload-progress show">
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-divider" />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>{t.cancel}</button>
          <button className="btn-submit" disabled={loading} onClick={handleSubmit}>
            <span>{submitText}</span>
            {loading && <div className="spinner show" />}
          </button>
        </div>
      </div>
    </div>
  );
}
