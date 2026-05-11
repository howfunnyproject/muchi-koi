"use client";
import { useState } from "react";
import { UserLocation } from "@/lib/types";

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function locate(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        resolve(null);
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setLocating(false);
          resolve(loc);
        },
        () => {
          setError("Location unavailable");
          setLocating(false);
          resolve(null);
        },
        { timeout: 8000 }
      );
    });
  }

  return { location, locating, error, locate };
}
