"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // helper to create client with token

export function useSessionTrends() {
  const [trends, setTrends] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTrends() {
    setLoading(true);
    setError(null);

    try {
      // Fetch latest session_trends entry
      const { data, error: fetchError } = await supabase
        .from("session_trends")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setTrends(null);
      } else {
        setTrends(data || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch trends");
      setTrends(null);
    }

    setLoading(false);
  }

  return { trends, loading, error, fetchTrends };
}
