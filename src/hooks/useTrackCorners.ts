"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 

interface CornerPoint {
  lat: number;
  lon: number;
}

export function useTrackCorners(trackId: string | null) {
  const [corners, setCorners] = useState<CornerPoint[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) return;

    const fetchCorners = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("track_configurations")
          .select("corners")
          .eq("track_id", trackId)
          .single();

        if (error) {
          console.error("Error fetching track corners:", error);
          setCorners(null);
        } else {
          setCorners(data?.corners || []);
        }
      } catch (error) {
        console.error(error);
        setCorners(null);
      }
      setLoading(false);
    };

    fetchCorners();
  }, [trackId]);

  return { corners, loading };
}
