import {
  collection, addDoc, getDocs,
  query, orderBy, serverTimestamp, DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Cobbler {
  id: string;
  name: string;
  phone: string;
  area: string;              // locationDescription in the original
  services: string[];
  workHours: string | null;
  workDays: string | null;
  photos: string[];          // array of Cloudinary URLs
  lat: number;
  lng: number;
  rating: number | null;
  isNew: boolean;
  verified: boolean;
  createdAt: Date | null;
}

export async function fetchCobblers(): Promise<Cobbler[]> {
  const snap = await getDocs(query(collection(db, "cobblers"), orderBy("createdAt", "desc")));
  return snap.docs.map((doc) => {
    const d = doc.data() as DocumentData;
    return {
      id:           doc.id,
      name:         d.name        ?? "",
      phone:        d.phone       ?? "",
      area:         d.area        ?? "",
      services:     d.services    ?? [],
      workHours:    d.workHours   ?? null,
      workDays:     d.workDays    ?? null,
      photos:       d.photos      ?? [],
      lat:          d.lat         ?? 0,
      lng:          d.lng         ?? 0,
      rating:       d.rating      ?? null,
      isNew:        d.isNew       ?? false,
      verified:     d.verified    !== false,
      createdAt:    d.createdAt?.toDate?.() ?? null,
    };
  });
}

export async function addCobbler(payload: {
  name: string; phone: string; area: string;
  services: string[]; workHours: string | null; workDays: string | null;
  photos: string[]; lat: number; lng: number;
}): Promise<string> {
  const ref = await addDoc(collection(db, "cobblers"), {
    ...payload,
    rating:    null,
    isNew:     true,
    verified:  true,          // show immediately; set false if you want moderation
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
