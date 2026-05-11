"use client";
import { useState, useEffect } from "react";
import { fetchCobblers } from "@/lib/firestore";
import { Cobbler } from "@/lib/types";

export function useCobblers() {
  const [cobblers, setCobblers] = useState<Cobbler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCobblers()
      .then((data) => {
        setCobblers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function addOptimistic(cobbler: Cobbler) {
    setCobblers((prev) => [cobbler, ...prev]);
  }

  return { cobblers, loading, error, addOptimistic };
}
