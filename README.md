# Muchi Koi 👟

> Find a cobbler anytime — ঢাকার যেকোনো সময় মুচি খুঁজুন

Community-driven hyperlocal cobbler finder for Dhaka. Built with Next.js 14, Firebase Firestore, Leaflet maps, and Cloudinary.

**Developed by [Shakib Mahamud](https://shakib-mahamud.vercel.app/)**

---

## 🚀 Deploy to Vercel

### Step 1 — Push to GitHub
```bash
cd muchi-koi
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Add env vars in Vercel
In **Vercel → Settings → Environment Variables**, add these 9 vars:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDOSUl4rr6SjJmnjdTHYmB2gzsvTpdEPUQ` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `muchi-koi.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `muchi-koi` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `muchi-koi.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `535483166463` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:535483166463:web:67bc895ed86010da1a26ca` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-V9LK92LB68` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dd2znqqod` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `muchi_koi_upload` |

### Step 3 — Deploy
Vercel auto-deploys on every push. ✅

---

## 💻 Run locally
```bash
npm install
npm run dev
# visit http://localhost:3000
```

---

## 🔥 Firebase Firestore rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cobblers/{docId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

---

## ☁️ Cloudinary
Make sure upload preset `muchi_koi_upload` is set to **Unsigned** in your Cloudinary dashboard.

---

## 📁 Structure
```
app/
  layout.tsx       Root layout + metadata
  page.tsx         Entire app (landing + find page + modal)
  globals.css      Leaflet CSS + font imports + keyframes only
components/
  LeafletMap.tsx   Real Leaflet map, dynamic import (no SSR)
lib/
  firebase.ts      Firebase init
  firestore.ts     Firestore read/write
  cloudinary.ts    Image compress + upload
```
